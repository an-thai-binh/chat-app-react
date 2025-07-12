import LoginForm from "../features/auth/components/LoginForm";

export default function Login() {
    return (
        <div className="bg-gray-500 w-full">
            <div className="flex justify-center items-center min-h-screen">
                <LoginForm />
            </div>
        </div>
    );
}