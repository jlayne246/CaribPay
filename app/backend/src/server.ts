import { createApp } from './app';
import { env_mod } from 'framework';

const PORT = env_mod.env.PORT || 3000;

const startServer = () => {
    const app = createApp();

    app.listen(PORT, () => {
        console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
};

export { startServer };
