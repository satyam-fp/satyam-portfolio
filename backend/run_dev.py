#!/usr/bin/env python3
"""
Development server runner for Neural Space Portfolio API
"""
import uvicorn
import os
from dotenv import load_dotenv

if __name__ == "__main__":
    # Load environment variables
    load_dotenv()
    
    # Get configuration from environment variables
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    
    print(f"🚀 Starting Neural Space Portfolio API on {host}:{port}")
    print("📝 API Documentation will be available at:")
    print(f"   - Swagger UI: http://{host}:{port}/docs")
    print(f"   - ReDoc: http://{host}:{port}/redoc")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )