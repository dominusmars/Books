import React from "react";
import LoginForm from "./components/LoginForm";

type Props = {};

function Page({}: Props) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-black">
            <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
            <LoginForm />
        </div>
    );
}

export default Page;
