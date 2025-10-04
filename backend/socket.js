import User from "./models/user.model.js"

export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log("⚡ New socket connected:", socket.id)

        // when user connect
        socket.on("identity", async ({ userId }) => {
            try {
                const user = await User.findByIdAndUpdate(userId, {
                    socketId: socket.id,
                    isOnline: true
                }, { new: true })

            } catch (error) {
                console.log(error)
            }
        })

        // when delivery boy location updates
        socket.on('updateLocation', async ({latitude, longitude, deliveryBoyId}) => {
            try {
                const deliveryBoy = await User.findByIdAndUpdate(deliveryBoyId, {
                    location: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    isOnline: true,
                    socketId: socket.id
                })

                if(deliveryBoy){
                    // emit event to update delivery boy location in user order tracking map
                    io.emit('updateDeliveryLocation', {
                        deliveryBoyId,
                        latitude,
                        longitude
                    })
                }

            } catch (error) {
                console.log("Update delivery location error: ", error)
            }
        })

        // when user disconnect
        socket.on("disconnect", async () => {
            try {
                console.log("Disconnect: ", socket.id)

                await User.findOneAndUpdate({ socketId: socket.id }, {
                    socketId: null,
                    isOnline: false
                })
            } catch (error) {
                console.log(error)
            }
        })
    })
}