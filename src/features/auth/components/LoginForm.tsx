import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import api from "../../../services/apiConfig";
import { setAccessToken, setRefreshToken } from "../../../utils/localStorageUtils";
import { ApiEndpoints } from "../../../constants/endpoints";

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

    const onSubmit = async (data: FormData) => {
        try {
            const response = await api.post(ApiEndpoints.LOGIN, data);
            if (response.data.success) {
                const { accessToken, refreshToken } = response.data.data;
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                navigate("/");
            }
        } catch (error: any) {
            const message = error.response?.data.message || error.message;
            console.error("Authentication Error:", message);
        }
    }

    return (
        <div className="p-3 w-[450px] bg-gray-100 rounded-md ">
            <div className="flex justify-end">
                <Link to={"/register"}>
                    <p className="hover:underline cursor-pointer">Create an account</p>
                </Link>
            </div>
            <p className="text-center text-2xl font-bold">Login</p>
            <div>
                <p>Username/Email</p>
                <input {...register("identifier")} type="text" className="w-full h-10 p-3 rounded-lg border border-gray-300 outline-gray-300" />
                <p className="ms-1 text-red-500 text-sm">{errors.identifier?.message}</p>
            </div>
            <div className="mt-3">
                <p>Password</p>
                <input {...register("password")} type="password" className="w-full h-10 p-3 rounded-lg border border-gray-300 outline-gray-300" />
                <p className="ms-1 text-red-500 text-sm">{errors.password?.message}</p>
            </div>
            <div className="flex justify-end">
                <p className="hover:underline cursor-pointer">Forgot password</p>
            </div>
            <div className="w-fit mx-auto">
                <button className="px-2 h-10 bg-yellow-400 font-bold rounded-md hover:bg-yellow-500" onClick={handleSubmit(onSubmit)}>Sign in</button>
            </div>
        </div>
    );
}