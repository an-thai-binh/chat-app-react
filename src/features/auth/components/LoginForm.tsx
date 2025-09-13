import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { setAccessToken, setRefreshToken } from "../../../utils/localStorageUtils";
import { ApiEndpoints } from "../../../constants/endpoints";
import { useEffect, useState } from "react";
import axios from "axios";

const schema = z.object({
    identifier: z.string().min(1, "Username must not be blank"),
    password: z.string().min(1, "Password must not be blank")
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onSubmit'
    });

    const navigate = useNavigate();

    const [isSubmittingLogin, setIsSubmittingLogin] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<string>("");

    const onSubmit = async (data: FormData) => {
        try {
            setIsSubmittingLogin(true);
            const response = await axios.post(ApiEndpoints.LOGIN, data);
            if (response.data.success) {
                const { accessToken, refreshToken } = response.data.data;
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                navigate("/");
            }
        } catch (error: any) {
            const message = error.response?.data.message || error.message;
            setLoginError(message);
            console.error("Authentication Error:", message);
        } finally {
            setIsSubmittingLogin(false);
        }
    }

    useEffect(() => {
        document.body.style.cursor = isSubmittingLogin ? "wait" : "default";
    }, [isSubmittingLogin]);

    return (
        <div className="p-3 w-[450px] bg-gray-100 rounded-md ">
            <div className="flex justify-end">
                <Link to={"/register"}>
                    <p className="hover:underline cursor-pointer">Create an account</p>
                </Link>
            </div>
            <p className="text-center text-2xl font-bold">Login</p>
            <p className="text-center text-red-500 text-sm italic">{loginError}</p>
            <div>
                <p>Username/Email</p>
                <input {...register("identifier")} type="text" onFocus={() => setLoginError("")} className="w-full h-10 p-3 rounded-lg border border-gray-300 outline-gray-300" />
                <p className="ms-1 text-red-500 text-sm italic">{errors.identifier?.message}</p>
            </div>
            <div className="mt-3">
                <p>Password</p>
                <input {...register("password")} type="password" onFocus={() => setLoginError("")} className="w-full h-10 p-3 rounded-lg border border-gray-300 outline-gray-300" />
                <p className="ms-1 text-red-500 text-sm italic">{errors.password?.message}</p>
            </div>
            <div className="flex justify-end">
                <p className="hover:underline cursor-pointer">Forgot password</p>
            </div>
            <div className="w-fit mx-auto">
                <button className="px-2 h-10 bg-yellow-400 font-bold rounded-md hover:bg-yellow-500 disabled:bg-yellow-500" onClick={handleSubmit(onSubmit)} disabled={isSubmittingLogin}>Sign in</button>
            </div>
        </div>
    );
}