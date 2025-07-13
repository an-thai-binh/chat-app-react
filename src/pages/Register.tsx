import RegisterForm from "../features/auth/components/RegisterForm";

export default function Register() {
    return (
        <div className="bg-gray-500 w-full">
            <div className="flex justify-center items-center min-h-screen">
                <RegisterForm />
            </div>
        </div>
    );
}