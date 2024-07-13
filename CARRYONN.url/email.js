async function verifyEmail(email) {
    // Regular expression for basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return { valid: false, reason: "Invalid email format" };
    }

    // Split email to extract domain for DNS MX lookup
    const [, domain] = email.split('@');

    try {
        // Try to fetch DNS MX records for the domain
        const mxRecords = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
        const mxRecordsJson = await mxRecords.json();

        // Check if there are any MX records
        if (mxRecordsJson.Answer && mxRecordsJson.Answer.length > 0) {
            return { valid: true };
        } else {
            return { valid: false, reason: "Domain does not have MX records" };
        }
    } catch (error) {
        console.error("Error fetching MX records:", error);
        return { valid: false, reason: "Error fetching MX records" };
    }
}

// Example usage:
const emailToVerify = "example@example.com";
verifyEmail(emailToVerify)
    .then(result => {
        if (result.valid) {
            console.log(`Email ${emailToVerify} is valid!`);
        } else {
            console.log(`Email ${emailToVerify} is not valid: ${result.reason}`);
        }
    })
    .catch(error => console.error("Error verifying email:", error));
