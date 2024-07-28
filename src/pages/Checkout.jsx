import { redirect } from "react-router-dom";

import { customFetch, formatPrice } from "../utils";
import { toast } from "react-toastify";
import { clearCart } from "../features/cart/cartSlice";

import { store } from "../store";
import { useSelector } from "react-redux";
import { CartTotals, SectionTitle } from "../components";
import CheckoutForm from "../components/CheckoutForm";

import { queryClient } from "../App";

export const loader = async () => {
  const user = store.getState().userState.user;

  if (!user) {
    toast.warn("You must be logged in to checkout");
    return redirect("/login");
  }

  return null;
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const { name, address } = Object.fromEntries(formData);
  const user = store.getState().userState.user;
  const { cartItems, orderTotal, numItemsInCart } = store.getState().cartState;

  const info = {
    name,
    address,
    chargeTotal: orderTotal,
    orderTotal: formatPrice(orderTotal),
    cartItems,
    numItemsInCart,
  };

  try {
    await customFetch.post(
      "/orders",
      { data: info },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    queryClient.removeQueries(["orders"]);
    store.dispatch(clearCart());
    toast.success("Order placed successfully");
    return redirect("/orders");
  } catch (error) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.error?.message ||
      "There was an error placing your order";

    toast.error(errorMessage);
    if (error.response.status === 401 || error.response.status === 403)
      redirect("/login");
    return null;
  }
};

const Checkout = () => {
  const cartTotal = useSelector((state) => state.cartState.cartTotal);

  if (cartTotal === 0) {
    return <SectionTitle text="Your cart is empty" />;
  }

  return (
    <>
      <SectionTitle text="Place your order" />
      <div className="mt-8 grid gap-8 md:grid-cols-2 items-start">
        <CheckoutForm />
        <CartTotals />
      </div>
    </>
  );
};

export default Checkout;
