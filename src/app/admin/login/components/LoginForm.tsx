"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
type Props = {};

const LoginForm: React.FC<Props> = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [Errored, SetError] = useState<string | false>(false);
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        SetError(false);
        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                throw new Error(await response.text());
            }
            const data = await response.json();
            if (data.success) {
                // Handle successful login
                console.log("Login successful");
                router.push("/admin/dashboard");
            } else {
                // Handle login failure
                console.error("Login failed");
            }
        } catch (error) {
            console.error("Error:", error);
            if (error instanceof Error) SetError(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-fit">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                {/* <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2> */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Username
                        </label>
                        <input
                            type="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    {Errored && <div className="text-red-400">{Errored}</div>}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
