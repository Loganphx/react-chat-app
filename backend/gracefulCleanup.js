// let isShuttingDown = false;
// export const gracefulShutdown = async (event) => {
//     if (isShuttingDown) return; // Prevent double shutdown
//     isShuttingDown = true;
//
//     console.log(`Received ${event}. Closing server...`);
//
//
//     // If you have a DB connection, close it here
//     try {
//         console.log('Closing MongoDB connection...');
//         await mongoose.disconnect();
//         console.log('MongoDB disconnected');
//     } catch (err) {
//         console.error('Error disconnecting DB', err);
//     }
//
//     const forceTimeout = setTimeout(() => {
//         console.warn('Forcing exit due to timeout!');
//         connections.forEach(conn => conn.destroy());
//         process.exit(1);
//     }, 4500);
//
//     try {
//         await new Promise((resolve, reject) => {
//             server.close(err => {
//                 clearTimeout(forceTimeout);
//                 if (err) return reject(err);
//                 resolve();
//             });
//         });
//         connections.forEach(conn => conn.destroy());
//         console.log('Server closed and connections destroyed');
//     } catch (err) {
//         console.error('Error closing server:', err);
//     }
//
//     await log();
//
//     console.log('Cleanup done, exiting process.');
//     process.exit(0);
// }
//
