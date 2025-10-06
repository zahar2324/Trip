import emailjs from "@emailjs/browser";

export const sendInviteEmail = async (toEmail: string, inviteLink: string) => {
  try {
    await emailjs.send(
      "service_o7eda2j",      
      "template_u5qrsiw",     
      {
        to_email: toEmail,        
        invite_link: inviteLink   
      },
      "JllCPgwFzn2O2WNBH"         
    );
  } catch (e) {
    console.error("EmailJS error:", e);
    throw new Error("Не вдалося надіслати email");
  }
};
