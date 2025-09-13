import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { ApiEndpoints } from "../../../constants/endpoints";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const schema = z.object({
    username: z.string().min(1, "Username must not be blank"),
    email: z.email("Invalid email").min(1, "Email must not be blank"),
    password: z.string().min(6, "Password must have at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password must not be blank"),
    isFemale: z.enum(['true', 'false']),
    birthDate: z.iso.date()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"]
});

type FormData = z.infer<typeof schema>;

export default function RegisterForm() {
    const { register, handleSubmit, trigger, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            isFemale: 'false'
        }
    });

    const navigate = useNavigate();

    const [isSubmittingRegister, setIsSubmittingRegister] = useState<boolean>(false);
    const [registerError, setRegisterError] = useState<string>("");

    const onSubmit = async (data: FormData) => {
        try {
            setIsSubmittingRegister(true);
            const payload = {
                ...data,
                isFemale: data.isFemale === "true"
            }
            const response = await axios.post(ApiEndpoints.REGISTER, payload);
            if (response.data.success) {
                toast.success("Registration Successful...")
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            }
        } catch (error: any) {
            const message = error.response?.data.message || error.message;
            setRegisterError(message);
            console.error("Authentication Error: ", message);
        } finally {
            setIsSubmittingRegister(false);
        }
    }

    useEffect(() => {
        document.body.style.cursor = isSubmittingRegister ? "wait" : "default";
    }, [isSubmittingRegister]);

    return (
        <div className="p-3 w-[450px] bg-gray-100 rounded-md ">
            <p className="text-center text-2xl font-bold">Create Account</p>
            <p className="text-center text-red-500 text-sm italic">{registerError}</p>
            <div>
                <label>Username<span className="text-red-500"> *</span></label>
                <input {...register("username")} type="text" onFocus={() => setRegisterError("")} className="w-full h-10 p-3 rounded-lg border border-gray-300 outline-gray-300" />
                <p className="ms-1 text-red-500 text-sm italic">{errors.username?.message}</p>
            </div>
            <div className="mt-3">
                <label>Email<span className="text-red-500"> *</span></label>
                <input {...register("email")} type="text" onFocus={() => setRegisterError("")} className="w-full h-10 p-3 rounded-lg border border-gray-300 outline-gray-300" />
                <p className="ms-1 text-red-500 text-sm italic">{errors.email?.message}</p>
            </div>
            <div className="mt-3">
                <label>Password<span className="text-red-500"> *</span></label>
                <input {...register("password")} type="password" onFocus={() => setRegisterError("")}
                    onChange={(e) => {
                        register("password").onChange(e);
                        trigger("confirmPassword");
                    }}
                    className="w-full h-10 p-3 rounded-lg border border-gray-300 outline-gray-300" />
                <p className="ms-1 text-red-500 text-sm italic">{errors.password?.message}</p>
            </div>
            <div className="mt-3">
                <label>Confirm password<span className="text-red-500"> *</span></label>
                <input {...register("confirmPassword")} type="password" onFocus={() => setRegisterError("")} className="w-full h-10 p-3 rounded-lg border border-gray-300 outline-gray-300" />
                <p className="ms-1 text-red-500 text-sm italic">{errors.confirmPassword?.message}</p>
            </div>
            <div className="mt-3">
                <div className="flex items-center">
                    <label className="basis-1/3">Gender<span className="text-red-500"> *</span></label>
                    <div className="basis-1/3 flex items-center">
                        <input {...register("isFemale")} type="radio" value="false" className="size-5" />
                        <label className="ms-2">Male</label>
                    </div>
                    <div className="basis-1/3 flex items-center">
                        <input {...register("isFemale")} type="radio" value="true" className="size-5" />
                        <label className="ms-2">Female</label>
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <div className="flex items-center">
                    <label className="me-3">Birthday<span className="text-red-500"> *</span></label>
                    <input {...register("birthDate")} type="date" className="flex-1 h-10 p-3 rounded-lg border border-gray-300 outline-gray-300" />
                    <p className="ms-1 text-red-500 text-sm italic">{errors.birthDate?.message}</p>
                </div>
            </div>
            <div className="mt-3 w-fit mx-auto">
                <button className="px-2 h-10 bg-yellow-400 font-bold rounded-md hover:bg-yellow-500 disabled:bg-yellow-500" onClick={handleSubmit(onSubmit)} disabled={isSubmittingRegister}>Sign up</button>
            </div>
            <div className="flex justify-end mt-3">
                <Link to={"/login"}>
                    <p className="hover:underline cursor-pointer">Already have an account? Back to login...</p>
                </Link>
            </div>
        </div>
    );
}