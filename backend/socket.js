import User from "./models/user.model.js"
import logger from "./utils/logger.js"

export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        logger.info(`⚡ New socket connected: ${socket.id}`)

        // when user connect
        socket.on("identity", async ({ userId }) => {
            if (!userId) return;
            try {
                await User.findByIdAndUpdate(userId, {
                    socketId: socket.id,
                    isOnline: true
                }, { new: true })
            } catch (error) {
                logger.error(`Socket identity error for user ${userId}: ${error.message}`)
            }
        })

        // when delivery boy location updates
        socket.on('updateLocation', async ({ latitude, longitude, deliveryBoyId }) => {
            if (!deliveryBoyId || !latitude || !longitude) return;
            try {
                const deliveryBoy = await User.findByIdAndUpdate(deliveryBoyId, {
                    location: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    isOnline: true,
                    socketId: socket.id
                })

                if (deliveryBoy) {
                    // emit event to update delivery boy location in user order tracking map
                    io.emit('updateDeliveryLocation', {
                        deliveryBoyId,
                        latitude,
                        longitude
                    })
                }
            } catch (error) {
                logger.error(`Update delivery location error: ${error.message}`)
            }
        })

        // when user disconnect
        socket.on("disconnect", async () => {
            try {
                logger.info(`Disconnect: ${socket.id}`)
                await User.findOneAndUpdate({ socketId: socket.id }, {
                    socketId: null,
                    isOnline: false
                })
            } catch (error) {
                logger.error(`Socket disconnect error: ${error.message}`)
            }
        })
    })
}