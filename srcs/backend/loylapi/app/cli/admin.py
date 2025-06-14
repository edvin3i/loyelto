import asyncio
import click
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.services.admin import admin_service
from app.schemas.admin import AdminCreate


@click.group()
def admin_cli():
    """Commands for handling admin users"""
    pass


@admin_cli.command()
@click.option("--email", prompt=True, help="Admin's Email")
@click.option("--password", prompt=True, hide_input=True, confirmation_prompt=True)
def create_admin(email: str, password: str):
    """Creating new admin user"""

    async def _create():
        async with AsyncSessionLocal() as db:
            # Checking the admin with the same email
            existing = await admin_service.get_by_email(db, email)
            if existing:
                click.echo(f"Admin user with email {email} is presented already!")
                return

            # creates admin user
            admin_data = AdminCreate(email=email, password=password)
            admin = await admin_service.create(db, admin_data)

            click.echo(f"✅ Admin user created successfully!")
            click.echo(f"Email: {admin.email}")
            click.echo(f"ID: {admin.id}")
            click.echo("\nAnd now you can enter to admin dashboard with user/email")
            click.echo("Recomendation: setup the 2FA after first login")

    asyncio.run(_create())


@admin_cli.command()
@click.option("--email", prompt=True, help="Admin's Email")
def disable_admin(email: str):
    """Deactivating admin user"""

    async def _disable():
        async with AsyncSessionLocal() as db:
            admin = await admin_service.get_by_email(db, email)
            if not admin:
                click.echo(f"Admin user with email {email} not found!")
                return

            admin.is_active = False
            await db.commit()
            click.echo(f"✅ Admin user {email} deactivated successfully!")

    asyncio.run(_disable())


@admin_cli.command()
def list_admins():
    """List all admin users"""

    async def _list():
        async with AsyncSessionLocal() as db:
            from app.models import Admin

            result = await db.execute(select(Admin).order_by(Admin.created_at))
            admins = result.scalars().all()

            if not admins:
                click.echo("No admin users found!")
                return

            click.echo("\nAdmin users:")
            click.echo("-" * 80)
            for admin in admins:
                status = "✅ Active" if admin.is_active else "❌ Not Active"
                totp = "🔐 2FA enabled" if admin.is_totp_enabled else "⚠️  2FA disabled"
                click.echo(f"{admin.email} | {status} | {totp}")
            click.echo("-" * 80)

    asyncio.run(_list())
