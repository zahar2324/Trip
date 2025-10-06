import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";


const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .required("Password is required"),
});

type FormData = {
  email: string;
  password: string;
};

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setSuccess("");
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      setSuccess("Account successfully created! 🎉");
      reset();


      setTimeout(() => {
        navigate("/");
      }, 2000); // 2 секунди
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-2xl rounded-2xl p-8 w-[90%] max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Create Account ✨
        </h2>

       
        <div className="mb-4 relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full pl-10 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

   
        <div className="mb-4 relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
            className="w-full pl-10 pr-10 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-400 hover:text-indigo-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

  
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {success && <p className="text-green-500 text-center mb-2">{success}</p>}

     
        <button
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Sign Up"}
        </button>
      </motion.form>
    </motion.div>
  );
}
