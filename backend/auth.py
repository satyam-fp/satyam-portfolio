"""
Authentication module for admin panel.
Handles password hashing, token generation, and session management.
"""

from datetime import datetime, timedelta
from typing import Optional
import secrets
from passlib.context import CryptContext
from jose import JWTError, jwt

# Password hashing configuration
# Using bcrypt with explicit rounds to avoid compatibility issues
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)

# JWT configuration
SECRET_KEY = "your-secret-key-change-in-production"  # Should be loaded from environment
ALGORITHM = "HS256"
SESSION_EXPIRY_HOURS = 24


def hash_password(password: str) -> str:
    """
    Hash a plain text password using bcrypt.
    
    Args:
        password: Plain text password to hash
        
    Returns:
        Hashed password string
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain text password against a hashed password.
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password to compare against
        
    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_session_token() -> str:
    """
    Generate a secure random session token.
    
    Returns:
        Secure random token string (64 characters)
    """
    return secrets.token_urlsafe(48)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token with optional expiration.
    
    Args:
        data: Dictionary of data to encode in the token
        expires_delta: Optional timedelta for token expiration
        
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=SESSION_EXPIRY_HOURS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt


def verify_session_token(token: str) -> Optional[dict]:
    """
    Verify and decode a JWT session token.
    
    Args:
        token: JWT token string to verify
        
    Returns:
        Decoded token data if valid, None if invalid or expired
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def get_session_expiry() -> datetime:
    """
    Get the expiration datetime for a new session.
    
    Returns:
        Datetime object representing session expiration time
    """
    return datetime.utcnow() + timedelta(hours=SESSION_EXPIRY_HOURS)


def is_session_expired(expires_at: datetime) -> bool:
    """
    Check if a session has expired.
    
    Args:
        expires_at: Datetime when the session expires
        
    Returns:
        True if session is expired, False otherwise
    """
    return datetime.utcnow() > expires_at
