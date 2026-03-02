import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsTicker({ articles, onSelectArticle }) {
    return (
        <div className="glass-panel w-96 h-[80vh] flex flex-col p-4 m-4 rounded-xl overflow-hidden mt-20 z-10 custom-shadow pointer-events-auto shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-[#FFD700] uppercase tracking-widest border-b border-[rgba(255,215,0,0.2)] pb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
                Live Pulse
            </h2>
            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-3">
                <AnimatePresence>
                    {articles.map((article, index) => (
                        <motion.div
                            key={article._id || `ticker-${index}-${article.title}`}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            onClick={() => onSelectArticle(article)}
                            className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg cursor-pointer transition-colors"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs text-[#FFD700] uppercase font-semibold">
                                    {article.location?.country || 'Global'}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                    {new Date(article.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-100 font-medium line-clamp-3">
                                {article.title}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-2 text-right">
                                {article.source}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {articles.length === 0 && (
                    <div className="text-center text-gray-500 text-sm mt-10">
                        Awaiting realtime intelligence...
                    </div>
                )}
            </div>
        </div>
    );
}
