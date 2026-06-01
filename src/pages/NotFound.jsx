// import { useMemo } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ArrowLeft, Rocket, Satellite, Telescope } from "lucide-react";

// const icons = [Rocket, Satellite, Telescope];

// const quotes = [
//   "You took a wrong turn somewhere.",
//   "This route doesn’t exist in this universe.",
//   "Nothing to see here. Literally.",
//   "You’re exploring beyond defined routes.",
//   "Even our servers are confused right now.",
//   "This endpoint has drifted into space.",
// ];

// const NotFound = () => {
//   const navigate = useNavigate();

//   const randomQuote = useMemo(
//     () => quotes[Math.floor(Math.random() * quotes.length)],
//     []
//   );

//   // ⭐ Stars with depth
//   const stars = useMemo(() => {
//     return Array.from({ length: 120 }).map((_, i) => {
//       const depth = Math.random();

//       return {
//         id: i,
//         top: Math.random() * 100,
//         left: Math.random() * 100,
//         size: depth > 0.7 ? 2 : 1,
//         opacity: 0.15 + depth * 0.6,
//         blur: depth < 0.3 ? 1 : 0,
//         duration: 2 + Math.random() * 3,
//         delay: Math.random() * 3,
//       };
//     });
//   }, []);

//   // 🚀 Floating icons
//   const floatingIcons = useMemo(() => {
//     return Array.from({ length: 18 }).map((_, i) => {
//       const Icon = icons[Math.floor(Math.random() * icons.length)];

//       return {
//         id: i,
//         Icon,
//         top: Math.random() * 100,
//         left: Math.random() * 100,
//         size: 14 + Math.random() * 18,
//         duration: 6 + Math.random() * 6,
//         delay: Math.random() * 5,
//         opacity: 0.08 + Math.random() * 0.2,
//       };
//     });
//   }, []);

//   return (
//     <div
//       className="
//       min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6
//       bg-white text-gray-900
//       dark:bg-black dark:text-white
//     "
//     >
//       {/* 🌌 Background */}
//       <div
//         className="
//         absolute inset-0
//         bg-gradient-to-b from-gray-100 via-white to-gray-200
//         dark:from-black dark:via-gray-900 dark:to-black
//       "
//       />

//       {/* ⭐ Stars */}
//       <div className="absolute inset-0 pointer-events-none">
//         {stars.map(
//           ({ id, top, left, size, opacity, blur, duration, delay }) => (
//             <motion.span
//               key={id}
//               className="absolute rounded-full bg-gray-400/60 dark:bg-white"
//               style={{
//                 width: size,
//                 height: size,
//                 top: `${top}%`,
//                 left: `${left}%`,
//                 opacity,
//                 filter: `blur(${blur}px)`,
//               }}
//               animate={{
//                 opacity: [opacity * 0.6, opacity, opacity * 0.6],
//                 scale: size === 2 ? [1, 1.4, 1] : [1, 1.2, 1],
//               }}
//               transition={{
//                 duration,
//                 repeat: Infinity,
//                 delay,
//                 ease: "easeInOut",
//               }}
//             />
//           )
//         )}
//       </div>

//       {/* 🚀 Floating Icons */}
//       <div className="absolute inset-0 pointer-events-none">
//         {floatingIcons.map(
//           ({ id, Icon, top, left, size, duration, delay, opacity }) => (
//             <motion.div
//               key={id}
//               className="absolute text-gray-400 dark:text-white"
//               style={{ top: `${top}%`, left: `${left}%`, opacity }}
//               animate={{
//                 y: [0, -20, 0],
//                 rotate: [0, 8, -8, 0],
//               }}
//               transition={{
//                 duration,
//                 repeat: Infinity,
//                 delay,
//                 ease: "easeInOut",
//               }}
//             >
//               <Icon size={size} />
//             </motion.div>
//           )
//         )}
//       </div>

//       {/* 🌠 Shooting Star */}
//       <motion.div
//         className="absolute w-[2px] h-24 rotate-45 bg-gray-400 dark:bg-white top-0 left-[60%]"
//         initial={{ opacity: 0 }}
//         animate={{ y: [0, 700], opacity: [0, 1, 0] }}
//         transition={{ duration: 2.5, repeat: Infinity, delay: 3 }}
//       />

//       {/* 🎯 Content */}
//       <div className="relative z-10 text-center">
//         <h1
//           className="text-[110px] font-extrabold tracking-widest bg-linear-to-r from-primary via-pink-500 to-indigo-500 text-transparent bg-clip-text"
//         >
//           404
//         </h1>

//         <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
//           Page Not Found
//         </h2>

//         <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
//           {randomQuote}
//         </p>

//         {/* 🔘 Buttons */}
//         <div className="flex gap-4 mt-8 justify-center">
//           <Link
//             to="/"
//             className="px-6 py-3 bg-linear-to-r from-primary to-pink-500 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
//           >
//             <ArrowLeft size={18} />
//             Home
//           </Link>

//           <button
//             onClick={() => navigate(-1)}
//             className="
//               px-6 py-3 rounded-lg transition
//               border border-gray-300 text-gray-700 hover:bg-gray-100
//               dark:border-white/20 dark:text-white dark:hover:bg-white/10
//             "
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotFound;

import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare } from "lucide-react";
import Logo from "../components/Logo/Logo";

const quotes = [
  "This conversation doesn't exist.",
  "Looks like this chat got deleted.",
  "You've wandered outside the chat room.",
  "No messages found here.",
  "This room is empty. Always has been.",
  "Even CONVOC can't find this page.",
];

const NotFound = () => {
  const navigate = useNavigate();

  const randomQuote = useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    []
  );

  // blurred circles matching CONVOC's home screen
  const circles = useMemo(() => [
    { w: 320, h: 320, top: "-80px", left: "55%",  opacity: 0.25, blur: 60, delay: 0    },
    { w: 500, h: 500, top: "55%",   left: "-60px", opacity: 0.2,  blur: 80, delay: 0.4 },
    { w: 220, h: 220, top: "30%",   left: "80%",   opacity: 0.15, blur: 50, delay: 0.8 },
  ], []);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden bg-white px-4 sm:px-6 ">

      {/* blurred circle decorations — matches CONVOC home */}
      {circles.map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: c.w,
            height: c.h,
            top: c.top,
            left: c.left,
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            opacity: c.opacity,
            filter: `blur(${c.blur}px)`,
          }}
        //   animate={{ scale: [1, 1.05, 1], opacity: [c.opacity, c.opacity * 1.3, c.opacity] }}
        //   transition={{ duration: 6, repeat: Infinity, delay: c.delay, ease: "easeInOut" }}
        />
      ))}

      {/* content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">

        {/* CONVOC logo */}
        <div className="w-full flex items-center justify-center gap-2 mb-10">
          <Logo type={1} className='w-30 sm:w-32 md:w-36 lg:w-44 ' />
        </div>

        {/* 404 number */}
        <motion.h1 className="text-[80px] sm:text-[100px] md:text-[130px] lg:text-[160px] font-extrabold leading-none tracking-tight bg-linear-to-r from-primary via-indigo-400 to-secondary text-transparent bg-clip-text select-none" animate={{ opacity: [0.85, 1, 0.85] }}transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>404</motion.h1>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="mt-3 text-gray-400 max-w-xs sm:max-w-sm md:max-w-md mx-auto text-sm">{randomQuote}</p>

        {/* buttons matching CONVOC style */}
        <div className="flex gap-3 mt-10">
          <Link to="/" className="px-6 py-3 bg-linear-to-r from-primary to-secondary text-white rounded-full font-medium hover:opacity-90 transition shadow-lg shadow-primary/30 flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Chats
          </Link>

          <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-full font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
            Go Back
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotFound;


