import mongoose from "mongoose"

const deliveryAssignmentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },
    shopOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    broadcastedTo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    status: {
        type: String,
        enum: ["BroadCasted", "Assigned", "Completed"],
        default: "BroadCasted"
    },
    acceptedAt: Date

}, { timestamps: true })

deliveryAssignmentSchema.index({ assignedTo: 1, status: 1 })
deliveryAssignmentSchema.index({ broadcastedTo: 1 })
deliveryAssignmentSchema.index({ order: 1 })
deliveryAssignmentSchema.index({ shop: 1 })
deliveryAssignmentSchema.index({ acceptedAt: 1 })
deliveryAssignmentSchema.index({ createdAt: -1 })

const DeliveryAssignment = mongoose.model("DeliveryAssignment", deliveryAssignmentSchema)
export default DeliveryAssignment