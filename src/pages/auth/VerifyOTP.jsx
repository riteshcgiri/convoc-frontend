import React, { useRef, useState, useEffect } from 'react'
import Logo from '../../components/Logo/Logo'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "../../schemas/otp.schema";
import useAuthStore from "../../store/auth.store";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from '../../components/Inputs/Button';
import { LoaderCircle } from 'lucide-react';

const VerifyOTP = () => {

    const { handleSubmit, setValue, formState: { errors } } = useForm({ resolver: zodResolver(otpSchema) });
    const { loading, error, verifyOtp, resendOtp, verifyResetOtp } = useAuthStore()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");

    const inputsRef = useRef([]);
    const [timer, setTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)

    const handleChange = (e, index) => {
        let value = e.target.value;
        value = value.replace(/\D/g, "");
        e.target.value = value;

        if (value && index < 3) {
            inputsRef.current[index + 1].focus();
        }

        const otp = inputsRef.current
            .map((input) => input?.value || "")
            .join("");
        setValue("otp", otp);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const onSubmit = (data) => {
        if (loading) return;
        if (type === "reset") {
            verifyResetOtp(data.otp, navigate);
        } else {
            verifyOtp(data.otp, navigate);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        await resendOtp();
        setTimer(60);
        setCanResend(false);
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").replace(/\D/g, "");
        if (paste.length === 4) {
            paste.split("").forEach((digit, index) => {
                if (inputsRef.current[index]) {
                    inputsRef.current[index].value = digit;
                }
            });
            setValue("otp", paste);
        }
    };

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (timer <= 0) {
            setCanResend(true);
            return;
        }
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    return (
        <div className='w-full px-2 py-6 md:p-10'>

            {/* Logo */}
            <div className='w-full flex items-start justify-center mb-6'>
                <Logo type={4} className='w-3/5 sm:w-1/4 md:w-1/5 lg:w-3/12' />
            </div>

            {/* Content container */}
            <div className='w-full sm:w-4/5 md:w-3/5 mx-auto mt-8 md:mt-10'>

                <h2 className='text-center text-lg md:text-xl text-primary font-bold tracking-wide'>
                    Enter OTP
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 md:gap-7'>

                    {/* OTP inputs */}
                    <div
                        className='w-4/6 sm:w-4/5 md:w-2/5 flex justify-evenly gap-3 mx-auto mt-8 md:mt-10 text-primary'
                        onPaste={handlePaste}
                    >
                        {[0, 1, 2, 3].map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode='numeric'
                                pattern="[0-9]*"
                                maxLength={1}
                                max={9}
                                min={0}
                                ref={(el) => (inputsRef.current[index] = el)}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className='w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 hover:scale-105 transition-all border-2 border-primary focus:bg-primary/30 rounded-xl text-center text-xl md:text-3xl outline-none'
                            />
                        ))}
                    </div>

                    {/* Errors */}
                    {errors.otp && (
                        <p className="text-center text-red-500 text-sm">{errors.otp.message}</p>
                    )}
                    {error && (
                        <p className="text-center text-red-500 text-sm">{error}</p>
                    )}

                    {/* Submit button */}
                    <Button
                        children={
                            <div className='flex items-center justify-center'>
                                {loading
                                    ? <LoaderCircle className='animate-spin w-5 h-5 md:w-7 md:h-7' />
                                    : 'VERIFY'
                                }
                            </div>
                        }
                        className='w-3/4 sm:w-3/5 md:w-2/5 mx-auto cursor-pointer transition-all hover:scale-95 px-10 py-3 focus:outline-blue-300 bg-primary rounded-md text-white text-sm md:text-base'
                        type='submit'
                    />

                </form>

                {/* Resend OTP */}
                <div className='w-fit text-center mx-auto mt-8 md:mt-10 text-primary flex gap-2 text-sm md:text-base'>
                    Didn't Receive OTP?
                    {canResend
                        ? <Button
                            children='RESEND OTP'
                            handleClick={handleResend}
                            className='font-bold hover:underline cursor-pointer'
                          />
                        : <span className="text-gray-400">RESEND OTP in {timer}s</span>
                    }
                </div>

                {/* Contact us */}
                <div className='text-center mt-10 text-sm md:text-base text-zinc-600'>
                    Need help with something?{' '}
                    <Link className='font-bold text-primary' to='/support'>
                        Contact Us
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default VerifyOTP