# VaveLink
Visite the site here : [VaveLink Website](https://mhasiemmalik.github.io/VavelinkHomeRepo/)
## Description

VaveLink is a versatile web application built on WebRTC, Socket.IO, and Agora SDK, offering seamless communication via video, voice, or messages. With a focus on flexibility, privacy, and quality, VaveLink simplifies communication by enabling users to create rooms and connect with others without the need for mobile numbers, email addresses, or credentials. Users can directly enter a room name, whether created by themselves or others, and initiate communication instantly within their browser and network on a single electronic device.

### Modules

1. **VaveLink VideoChatRooms**

    The VaveLink VideoChatRooms module focuses on direct video call features using Agora SDK and WebRTC. Users can create a room and join a video call without entering any details. This communication is seamless and works across various platforms, including PC-to-PC, mobile-to-mobile, and mobile-to-PC. Only two people can communicate with each other at max.
    
    ![VideoChatRooms Screenshot 1](./ss/Vavelink%20Video%20chat.png)
    ![VideoChatRooms Screenshot 2](./ss/Vavelink%20Video%20on%20Mobile%20ss.png)
    [Visite the Module here](https://mhasiemmalik.github.io/VaveLink001/)

3. **VaveLink MessageRooms**

    The VaveLink MessageRooms module encourages users to enter their name and join chat rooms. Users can assume any name and create or join chat rooms. Two different servers are provided for messaging: a high-speed Socket.IO-based web server which is a traditional one deployed on koyab platform and a regular Agora SDKRTM which is recommended for low data consumptions. Users can also check the number of participants present in the room. Chat rooms support one-to-many communications, allowing more than two people to communicate simultaneously.

    ![MessageRooms Screenshot 1](./ss/Vavelink%20Message%20ss.png)
    ![MessageRooms Screenshot 2](./ss/VaveLink%20message%20ss%20(2).png)
    ![MessageRooms Screenshot 2](./ss/Vavelink%20Chatrooms.png)

4. **VaveLink GroupMeets**

    The VaveLink GroupMeets module focuses on video conferencing, chat, and screen sharing abilities. It allows two or more people to conduct meetings or conferences without any validations or verifications. Users can directly enter their name and room ID to join the conference with mic, video, and screen toggle options. Designed by Agora SDK files like Agora RTM and RTC, the module ensures seamless communication.
     
    ![GroupMeets Screenshot 1](./ss/Vavelink%20groupmeets.png)
    ![GroupMeets Screenshot 2](./ss/Vavelink%20Groupmeets%20mobile%20ss.png)
    [Visite the Module here](https://mhasiemmalik.github.io/VaveLink-GroupMeets/)

6. **VaveLink VoiceChatRooms**

    The VaveLink VoiceChatRooms module enables highly efficient voice communication among one-to-many people. Users can enter their name and room number to create or join existing rooms. The module supports full audio clarity without any echo, with mic toggle options which is also build on Agora RTM and STC SDK failes which help in signaling.
     
    ![VoiceChatRooms Screenshot 1](./ss/Vavelink%20Voice%20ss.png)
    ![VoiceChatRooms Screenshot 2](./ss/Vavelink%20Voice%20mobile%20ss.png)
   [Visite the Module here](https://mhasiemmalik.github.io/Vavelink-VoiceRooms/)

## Features

- High flexibility and privacy
- Seamless communication without installation
- High-quality video, voice, and messaging
- Anonymous communication
- Simple room creation and access

## Usage

Visit [VaveLink Website](#) to start using VaveLink immediately. Choose your preferred module and enter a room name to begin communication.

## Contributing

Contributions are welcome! Please follow the [contribution guidelines](CONTRIBUTING.md) when submitting pull requests.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries or support, feel free to contact us at [contact@example.com](mailto:contact@example.com).
