# Vouz Frontend

Welcome to the frontend repository of **Vouz**, an open-source, no-login, fully encrypted file-sharing platform. This project allows users to create secure lockers for file storage and sharing without the need for user accounts. For backend implementation details, visit the [Vouz Backend Repository](https://github.com/zadescoxp/locker-backend).

## Features

- **No Login Required**: Share files effortlessly without creating an account.
- **Secure Lockers**: Protect your files with unique passkeys.
- **Easy Sharing**: Share locker names and passkeys to grant access.
- **Open Source**: Contribute to the project and help improve it.

## Demo

Explore the live application at [vouz.tech](https://vouz.tech).
Take a look at the features on [YouTube](https://youtu.be/vPx3gnUQ1K8)

## Getting Started

To set up the project locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/zadescoxp/locker-frontend.git
   cd locker-frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   LOCK_SECRET=your_lock_secret
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

   - `LOCK_SECRET`: Replace `your_lock_secret` with a secure secret key for encryption.
   - `NEXT_PUBLIC_BACKEND_URL`: Set this to the URL where your backend server is running.

   > **Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Ensure that no sensitive information is included in these variables. 

4. **Run the Development Server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`.
3. Make your changes.
4. Commit your changes: `git commit -m 'Add new feature'`.
5. Push to the branch: `git push origin feature-branch-name`.
6. Open a pull request.

Please ensure your code adheres to our coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or suggestions, please open an issue in this repository.

---

Thank you for contributing to Vouz! 
