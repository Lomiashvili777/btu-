module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await fetch(
            'https://api-inference.huggingface.co/models/google/flan-t5-base',
            {
                headers: { Authorization: 'Bearer hf_placeholder' },
                method: 'POST',
                body: JSON.stringify({ inputs: message }),
            }
        );

        const result = await response.json();

        if (result[0] && result[0].generated_text) {
            const reply = result[0].generated_text;
            return res.status(200).json({ reply });
        } else if (result.error) {
            return res.status(500).json({ error: result.error });
        } else {
            return res.status(500).json({ error: 'No response from AI' });
        }
    } catch (error) {
        console.error('Chat API Error:', error);
        return res.status(500).json({ error: 'Failed to get response from AI' });
    }
};