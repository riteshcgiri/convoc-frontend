import { detectPlatform, parseAbout, extractUsername } from "../utils/aboutFormatter";
import DOMPurify from "dompurify";
import { Instagram, Twitter, Github, Globe , Linkedin, Hash,Youtube, Building, GraduationCap, MapPin, Sparkles } from 'lucide-react';
import { FaSpotify, FaSteam } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const iconMap = {
    instagram: Instagram,
    twitter: Twitter,
    github: Github,
    spotify: FaSpotify,
    steam: FaSteam,
    linkedin: Linkedin,
    youtube : Youtube,
    website: Globe
};

const platformColors = {
    instagram: "from-pink-500/20 to-purple-500/20 border-pink-500/30 text-pink-600 hover:border-pink-400/60",
    twitter: "from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-600 hover:border-sky-400/60",
    github: "from-zinc-500/20 to-zinc-700/20 border-zinc-500/30 text-zinc-600 hover:border-zinc-400/60",
    spotify: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-600 hover:border-green-400/60",
    steam: "from-blue-700/20 to-indigo-700/20 border-blue-600/30 text-blue-600 hover:border-blue-400/60",
    linkedin: "from-violet-600/20 to-cyan-500/20 border-violet-500/30 text-violet-600 hover:border-violet-400/60",
    website: "from-yellow-500/20 to-fuchsia-500/20 border-yellow-500/30 text-yellow-600 hover:border-yellow-400/60",
};

// Stagger container
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.05 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: "easeOut" } }
};

const AboutFormatter = ({ bio }) => {
    const parsed = parseAbout(bio);
    
    // Separate links from other items for a dedicated links row
    const mainItems = parsed?.filter(i => i?.type !== "link");
    const links = parsed?.filter(i => i?.type === "link");

    return (
        <motion.div className="space-y-4 text-zinc-300 text-xs" variants={containerVariants} initial="hidden" animate="visible">
            {mainItems?.map((item, index) => {

                if (item?.type === "text") {
                    return (
                        <motion.div key={index} variants={itemVariants}>
                            <div className="flex items-start gap-2 group ">
                                <motion.span animate={{ rotate: [0, 15, -10, 15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="mt-0.5 shrink-0">
                                </motion.span>
                                <p className="text-zinc-400 leading-relaxed"> {DOMPurify.sanitize(item?.value)} </p>
                            </div>
                        </motion.div>
                    );
                }

                if (item?.type === "hashtag") {
                    return (
                        <motion.span key={index} variants={itemVariants} whileHover={{ scale: 1.05, y: -1 }} className="inline-flex items-center gap-1 bg-zinc-100 border border-zinc-200 text-zinc-400 px-3 py-1 rounded-full text-xs font-normal mr-2 cursor-default">
                            <Hash size={11} />
                            {item?.value?.replace("#", "")}
                        </motion.span>
                    );
                }

                if (item?.type === "company") {
                    return (
                        <motion.div key={index} variants={itemVariants} whileHover={{ x: 4 }} className="flex items-center gap-3 text-xs group" >
                            <div className="p-1.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                                <Building size={13} />
                            </div>
                            <span className="text-zinc-400">{item?.value}</span>
                        </motion.div>
                    );
                }

                if (item?.type === "education") {
                    return (
                        <motion.div key={index} variants={itemVariants} whileHover={{ x: 4 }}
                            className="flex items-center gap-3 text-xs group"
                        >
                            <div className="p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                                <GraduationCap size={13} />
                            </div>
                            <span className="text-zinc-400">{item?.value}</span>
                        </motion.div>
                    );
                }

                if (item?.type === "location") {
                    return (
                        <motion.div key={index} variants={itemVariants} whileHover={{ x: 4 }} className="flex items-center gap-3 text-xs group" >
                            <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="p-1.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:bg-rose-500/20 transition-colors" >
                                <MapPin size={13} />
                            </motion.div>
                            <span className="text-zinc-400">{item?.value}</span>
                        </motion.div>
                    );
                }

                return null;
            })}

            {/* Links Section */}
            {links?.length > 0 && (
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-1 p-1">
                    {links.map((item, index) => {
                        const platform = detectPlatform(item?.value);
                        const Icon = iconMap[platform] || Globe;
                        const colors = platformColors[platform] || platformColors.website;
                        const username = extractUsername(item?.value);

                        return (
                            <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                                <Link to={item?.value} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 bg-gradient-to-r ${colors} border px-3.5 py-1.5 rounded-md  text-xs font-medium transition-all duration-200`}>
                                    <Icon size={13} />
                                    <span>{username}</span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </motion.div>
    );
};

export default AboutFormatter;