import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { json } from "react-router-dom";

const initialState = {
    cart: localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [],
    total: localStorage.getItem("total")
        ? JSON.parse(localStorage.getItem("total"))
        : 0,
    totalItems: localStorage.getItem("totalItems")
        ? JSON.parse(localStorage.getItem("totalItems"))
        : 0,
}

const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers: {
        setTotalItems(state, value) {
            state.token = value.payload;
        }
        ,
        resetCart: (state) => {
            state.cart = []
            state.total = 0
            state.totalItems = 0
            // Update to localstorage
            localStorage.removeItem("cart")
            localStorage.removeItem("total")
            localStorage.removeItem("totalItems")
        },
        // addToCart
        addToCart: (state, action) => {
            const course = action.payload;
            const index = state.cart.findIndex((item) => item._id === course._id)

            if (index >= 0) {
                toast.error("Course alredy in cart");
                return
            }
            state.cart.push(course)
            state.totalItems++
            state.total += course.price

            localStorage.setItem("cart", JSON.stringify(state.cart))
            localStorage.setItem("total", JSON.stringify(state.total))
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems))

            toast.success("Course added to card")

        },
        // removeToCart
        removeFromCart: (state, action) => {
            const courseId = action.payload
            const index = state.cart.findIndex((item) => item.id === courseId)

            if(index>=0){
                state.totalItems--
                state.total -= state.cart[index].price
                state.cart.splice(index,1)

                localStorage.setItem("cart", JSON.stringify(state.cart))
                localStorage.setItem("total", JSON.stringify(state.total))
                localStorage.setItem("totalItems", JSON.stringify(state.totalItems))

                toast.success("Successfully removed")
            }
        }
    }
})

export const { setTotalItems, resetCart,addToCart,removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;