# Video Calling App

## Features

- Real-time video calling
- Simple and intuitive UI
- Support for multiple participants
- Node.js backend for handling signaling
- React.js frontend for a dynamic user interface
- Socket.io for real-time communication

## Dependencies

- Express.js
- Node.js
- React.js
- Socket.io

## How it Works

The application uses a client-server architecture with the following components:

- **Express.js Server**: Handles signaling and manages communication between clients.
- **React.js Frontend**: Provides a user-friendly interface for initiating and managing video calls.
- **Socket.io**: Enables real-time communication between the server and clients.

When a user initiates a call, the server facilitates the exchange of necessary information between participants using Socket.io, establishing a direct peer-to-peer connection for the video call.

## Contributing

Feel free to contribute to the development of this project. Follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
