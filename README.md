# ChatAIForAll

ChatAIForAll is a versatile web application that allows users to interact with AI models for text generation and image creation. It provides a user-friendly interface for having conversations with AI and generating images based on text prompts.

## Features

- Chat interface for text-based conversations with AI
- Image generation based on text prompts
- Dark mode toggle
- Customizable AI model settings
- Multilingual support (English, Portuguese, Spanish)
- Markdown rendering for AI responses
- Syntax highlighting for code blocks
- Copy and download options for chat messages
- Responsive design for various screen sizes

## For Developers

### Project Structure

- `index.html`: The main HTML file that defines the structure of the web application.
- `script.js`: Contains the JavaScript code for handling user interactions, API calls, and dynamic content updates.
- `styles.css`: Defines the styles and layout for the application.

### Key Components

1. **Chat Interface**: Implemented in the main container, allowing users to send messages and receive AI responses.

2. **Settings Modal**: Accessible via the gear icon, allowing users to configure API keys and AI model parameters.

3. **Theme Toggle**: Enables switching between light and dark modes.

4. **Mode Toggle**: Allows switching between text chat and image generation modes.

5. **Localization**: Supports multiple languages with translations stored in the `translations` object.

### API Integration

The application integrates with OpenAI's API for both text generation and image creation. API calls are made using the `fetch` function in JavaScript.

### Security

- API keys are encrypted before being stored in local storage.
- A unique encryption key is generated for each user and stored securely.

### Customization

Developers can extend the application by:

- Adding new AI models to the `text-model` select options.
- Implementing additional language support in the `translations` object.
- Extending the settings modal with new parameters.

## For Users

### Getting Started

1. Open the ChatAIForAll application in your web browser.
2. Click the gear icon to open the settings modal.
3. Enter your OpenAI API key and adjust other settings as needed.
4. Click "Save" to store your settings.

### Using the Chat Interface

1. Type your message in the input field at the bottom of the screen.
2. Press Enter or click the send button to submit your message.
3. Wait for the AI to generate a response.
4. You can copy the response as Markdown or download it as a text file using the buttons below each message.

### Generating Images

1. Toggle the mode switch to enter image generation mode.
2. Enter a description of the image you want to create in the prompt field.
3. Click "Generate Image" to create the image based on your description.

### Customizing Your Experience

- Use the theme toggle to switch between light and dark modes.
- Adjust the AI model settings in the options modal to fine-tune the responses.
- Change the language using the language selector in the settings.

## Support

If you encounter any issues or have questions about using ChatAIForAll, please contact our support team or refer to the documentation for more detailed information.

---

Enjoy using ChatAIForAll for all your AI-powered conversations and image generation needs!
