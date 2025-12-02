"""
Real-time progress tracking server using FastAPI and WebSockets
Tracks anonymous users' progress across different courses and units
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
from datetime import datetime

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://goat-scraper.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active connections: {user_id: websocket}
active_connections: Dict[str, WebSocket] = {}

# Store user progress: {user_id: {courseId: {fileKey: bool}, username: str, lastUpdate: timestamp, study_items: {courseId: [fileKeys]}}}
user_progress: Dict[str, dict] = {}


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        
        # Initialize user progress if not exists
        if user_id not in user_progress:
            user_progress[user_id] = {
                "progress": {},
                "username": "",
                "lastUpdate": datetime.now().isoformat(),
                "study_items": {}
            }

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def broadcast_leaderboard(self, course_id: str):
        """Broadcast updated leaderboard to all connected users"""
        leaderboard = self.get_leaderboard(course_id)
        message = {
            "type": "leaderboard_update",
            "courseId": course_id,
            "leaderboard": leaderboard
        }
        
        disconnected = []
        for user_id, websocket in self.active_connections.items():
            try:
                await websocket.send_json(message)
            except Exception as e:
                print(f"Error sending to {user_id}: {e}")
                disconnected.append(user_id)
        
        # Clean up disconnected users
        for user_id in disconnected:
            self.disconnect(user_id)

    def get_leaderboard(self, course_id: str):
        """Generate leaderboard for a specific course"""
        leaderboard = []
        
        for user_id, data in user_progress.items():
            # Get the list of study items (fileKeys) for this course
            study_items = data.get("study_items", {}).get(course_id, [])
            
            # Only include users who have items in their study bucket for this course
            if study_items:
                course_progress = data.get("progress", {}).get(course_id, {})
                
                # Calculate completion based ONLY on items in study bucket
                completed_count = sum(1 for file_key in study_items if course_progress.get(file_key, False))
                total_count = len(study_items)
                percentage = (completed_count / total_count * 100) if total_count > 0 else 0
                
                leaderboard.append({
                    "userId": user_id,
                    "username": data.get("username", "Anonymous"),
                    "completed": completed_count,
                    "total": total_count,
                    "percentage": round(percentage, 1),
                    "lastUpdate": data.get("lastUpdate", "")
                })
        
        # Sort by percentage (descending), then by completed count
        leaderboard.sort(key=lambda x: (x["percentage"], x["completed"]), reverse=True)
        
        return leaderboard


manager = ConnectionManager()


@app.get("/")
async def root():
    return {
        "status": "online",
        "active_users": len(active_connections),
        "total_users": len(user_progress)
    }


@app.get("/leaderboard/{course_id}")
async def get_leaderboard(course_id: str):
    """Get leaderboard for a specific course"""
    return {
        "courseId": course_id,
        "leaderboard": manager.get_leaderboard(course_id)
    }


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    
    try:
        # Send initial connection confirmation
        await websocket.send_json({
            "type": "connected",
            "userId": user_id,
            "message": "Connected to progress tracking server"
        })
        
        while True:
            # Receive progress updates from client
            data = await websocket.receive_json()
            
            if data["type"] == "progress_update":
                course_id = data["courseId"]
                file_key = data["fileKey"]
                is_complete = data["isComplete"]
                username = data.get("username", "Anonymous")
                
                # Update user progress
                if user_id not in user_progress:
                    user_progress[user_id] = {"progress": {}, "username": username}
                
                if course_id not in user_progress[user_id]["progress"]:
                    user_progress[user_id]["progress"][course_id] = {}
                
                user_progress[user_id]["progress"][course_id][file_key] = is_complete
                user_progress[user_id]["username"] = username
                user_progress[user_id]["lastUpdate"] = datetime.now().isoformat()
                
                # Broadcast updated leaderboard to all users
                await manager.broadcast_leaderboard(course_id)
                
                # Send acknowledgment
                await websocket.send_json({
                    "type": "progress_ack",
                    "courseId": course_id,
                    "fileKey": file_key
                })
            
            elif data["type"] == "request_leaderboard":
                course_id = data["courseId"]
                leaderboard = manager.get_leaderboard(course_id)
                await websocket.send_json({
                    "type": "leaderboard_update",
                    "courseId": course_id,
                    "leaderboard": leaderboard
                })
            
            elif data["type"] == "set_username":
                username = data["username"]
                if user_id in user_progress:
                    user_progress[user_id]["username"] = username
                    await websocket.send_json({
                        "type": "username_updated",
                        "username": username
                    })
            
            elif data["type"] == "sync_study_items":
                course_id = data["courseId"]
                file_keys = data["fileKeys"]  # List of fileKeys in study bucket
                
                if user_id not in user_progress:
                    user_progress[user_id] = {"progress": {}, "username": "Anonymous", "study_items": {}}
                
                if "study_items" not in user_progress[user_id]:
                    user_progress[user_id]["study_items"] = {}
                
                user_progress[user_id]["study_items"][course_id] = file_keys
                user_progress[user_id]["lastUpdate"] = datetime.now().isoformat()
                
                # Broadcast updated leaderboard with corrected percentages
                await manager.broadcast_leaderboard(course_id)
                
                await websocket.send_json({
                    "type": "study_items_synced",
                    "courseId": course_id,
                    "count": len(file_keys)
                })
    
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        print(f"User {user_id} disconnected")
    except Exception as e:
        print(f"Error with user {user_id}: {e}")
        manager.disconnect(user_id)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
