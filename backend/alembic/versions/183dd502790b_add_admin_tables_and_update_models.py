"""add_admin_tables_and_update_models

Revision ID: 183dd502790b
Revises: c85ddfee0ca4
Create Date: 2025-10-14 01:00:26.424080

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = '183dd502790b'
down_revision = 'c85ddfee0ca4'
branch_labels = None
depends_on = None


def table_exists(table_name):
    """Check if a table exists in the database."""
    bind = op.get_bind()
    inspector = inspect(bind)
    return table_name in inspector.get_table_names()


def column_exists(table_name, column_name):
    """Check if a column exists in a table."""
    bind = op.get_bind()
    inspector = inspect(bind)
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    return column_name in columns


def upgrade() -> None:
    # Create admin_users table if it doesn't exist
    if not table_exists('admin_users'):
        op.create_table('admin_users',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('username', sa.String(length=50), nullable=False),
            sa.Column('password_hash', sa.String(length=255), nullable=False),
            sa.Column('email', sa.String(length=100), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
            sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index(op.f('ix_admin_users_id'), 'admin_users', ['id'], unique=False)
        op.create_index(op.f('ix_admin_users_username'), 'admin_users', ['username'], unique=True)
    
    # Create admin_sessions table if it doesn't exist
    if not table_exists('admin_sessions'):
        op.create_table('admin_sessions',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('user_id', sa.Integer(), nullable=False),
            sa.Column('session_token', sa.String(length=255), nullable=False),
            sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
            sa.ForeignKeyConstraint(['user_id'], ['admin_users.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index(op.f('ix_admin_sessions_id'), 'admin_sessions', ['id'], unique=False)
        op.create_index(op.f('ix_admin_sessions_session_token'), 'admin_sessions', ['session_token'], unique=True)
    
    # Create static_pages table if it doesn't exist
    if not table_exists('static_pages'):
        op.create_table('static_pages',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('page_key', sa.String(length=50), nullable=False),
            sa.Column('title', sa.String(length=200), nullable=False),
            sa.Column('content', sa.Text(), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index(op.f('ix_static_pages_id'), 'static_pages', ['id'], unique=False)
        op.create_index(op.f('ix_static_pages_page_key'), 'static_pages', ['page_key'], unique=True)
    
    # Use batch operations for SQLite compatibility when adding columns with defaults
    with op.batch_alter_table('projects', schema=None) as batch_op:
        if not column_exists('projects', 'content'):
            batch_op.add_column(sa.Column('content', sa.Text(), nullable=True))
        if not column_exists('projects', 'featured'):
            batch_op.add_column(sa.Column('featured', sa.Boolean(), nullable=False, server_default='0'))
        if not column_exists('projects', 'updated_at'):
            batch_op.add_column(sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True))
    
    # Use batch operations for blogs table
    with op.batch_alter_table('blogs', schema=None) as batch_op:
        if not column_exists('blogs', 'author'):
            batch_op.add_column(sa.Column('author', sa.String(), nullable=True))
        if not column_exists('blogs', 'tags'):
            batch_op.add_column(sa.Column('tags', sa.Text(), nullable=True))
        if not column_exists('blogs', 'image_url'):
            batch_op.add_column(sa.Column('image_url', sa.String(), nullable=True))
        if not column_exists('blogs', 'published'):
            batch_op.add_column(sa.Column('published', sa.Boolean(), nullable=False, server_default='1'))
        if not column_exists('blogs', 'published_at'):
            batch_op.add_column(sa.Column('published_at', sa.DateTime(timezone=True), nullable=True))
        if not column_exists('blogs', 'updated_at'):
            batch_op.add_column(sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True))
    
    # Update existing rows to set default values
    bind = op.get_bind()
    
    # Set default author for existing blogs
    if column_exists('blogs', 'author'):
        bind.execute(sa.text("UPDATE blogs SET author = 'Satyam' WHERE author IS NULL"))
    
    # Set default published status for existing blogs
    if column_exists('blogs', 'published'):
        bind.execute(sa.text("UPDATE blogs SET published = 1 WHERE published IS NULL"))
    
    # Set default featured status for existing projects
    if column_exists('projects', 'featured'):
        bind.execute(sa.text("UPDATE projects SET featured = 0 WHERE featured IS NULL"))


def downgrade() -> None:
    # Remove columns from blogs table
    op.drop_column('blogs', 'updated_at')
    op.drop_column('blogs', 'published_at')
    op.drop_column('blogs', 'published')
    op.drop_column('blogs', 'image_url')
    op.drop_column('blogs', 'tags')
    op.drop_column('blogs', 'author')
    
    # Remove columns from projects table
    op.drop_column('projects', 'updated_at')
    op.drop_column('projects', 'featured')
    op.drop_column('projects', 'content')
    
    # Drop static_pages table
    op.drop_index(op.f('ix_static_pages_page_key'), table_name='static_pages')
    op.drop_index(op.f('ix_static_pages_id'), table_name='static_pages')
    op.drop_table('static_pages')
    
    # Drop admin_sessions table
    op.drop_index(op.f('ix_admin_sessions_session_token'), table_name='admin_sessions')
    op.drop_index(op.f('ix_admin_sessions_id'), table_name='admin_sessions')
    op.drop_table('admin_sessions')
    
    # Drop admin_users table
    op.drop_index(op.f('ix_admin_users_username'), table_name='admin_users')
    op.drop_index(op.f('ix_admin_users_id'), table_name='admin_users')
    op.drop_table('admin_users')