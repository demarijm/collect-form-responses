import express from "express";
import bodyParser from "body-parser";
import { Resend } from "resend";
// const hubspot = require('@hubspot/api-client')
// import hubspot from "@hubspot/api-client";
const app = express();

// Parse incoming form-encoded data and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (!process.env.RESEND_API_KEY) {
  console.error("RESEND_API_KEY environment variable is required");
  process.exit(1);
}

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// const hubspotClient = new hubspot.Client({ accessToken: process.env.HUBSPOT_API_KEY })

app.get("/", (req, res) => {
  res.send("Hello from Express on Render!");
});
app.get("/healthz", (req, res) => {
  res.send("We are healthy!");
});
// Handle form submission
app.post("/submit", async (req, res) => {
  const formData = req.body; // Form fields
  //   const contactObj = {
  //     properties: {
  //         firstname: "",
  //         lastname: "",
  //     },
  // }
  // const createContactResponse = await hubspotClient.crm.contacts.basicApi.create(contactObj)
  const { data, error } = await resend.emails.send({
    from: "Demari Miller <demari@tecplus.io>",
    to: "demarijmiller@gmail.com",
    subject: "New Form Submission",
    text: `You have a new form submission:\n\n${JSON.stringify(
      formData,
      null,
      2
    )}`,
  });
  console.log("Form submitted and email sent via Resend!", data);

  if (data) {
    return res.redirect("https://tactileaudiofurniture.com/pages/thank-you");
  }

  if (error) {
    console.error("Error sending via Resend:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
