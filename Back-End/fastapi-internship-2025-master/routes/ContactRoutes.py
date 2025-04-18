from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.sendMail import send_mail

# Initialize router with prefix
router = APIRouter(
    prefix="/api/v1",
    tags=["contact"],
    responses={404: {"description": "Not found"}},
)

class ContactForm(BaseModel):
    name: str
    email: str
    issue: str

@router.post("/contact", status_code=200)
async def handle_contact(contact: ContactForm):
    try:
        # Create HTML content for the email
        html_content = f"""
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {contact.name}</p>
        <p><strong>Email:</strong> {contact.email}</p>
        <p><strong>Issue:</strong></p>
        <p>{contact.issue}</p>
        """
        
        # Send email to the user
        send_mail(
            to_email=contact.email,
            subject="Thank you for contacting us",
            text=f"""
            <h2>Thank you for contacting us!</h2>
            <p>Dear {contact.name},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p>Your submitted issue:</p>
            <p>{contact.issue}</p>
            <br>
            <p>Best regards,</p>
            <p>The Auction Team</p>
            """
        )
        
        return {"status": "success", "message": "Contact form submitted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 