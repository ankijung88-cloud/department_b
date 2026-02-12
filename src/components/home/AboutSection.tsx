import React from 'react';
import { motion } from 'framer-motion';

export const AboutSection: React.FC = () => {
    return (
        <section className="py-32 bg-charcoal overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2"
                    >
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1533552865985-703cb2c3dfb6?q=80&w=1287&auto=format&fit=crop"
                                alt="Traditional Korean Aesthetic"
                                className="w-full rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute -bottom-10 -right-10 w-2/3 h-2/3 bg-dancheong-green/10 -z-10 rounded-lg"></div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2"
                    >
                        <h2 className="text-sm font-bold tracking-widest text-dancheong-green mb-4 uppercase">About Us</h2>
                        <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8 leading-tight">
                            전통과 현대가<br />
                            공존하는 공간
                        </h3>
                        <div className="space-y-6 text-lg text-white/70 font-light leading-relaxed">
                            <p>
                                문화백화점은 한국의 아름다운 전통 문화와 현대적인 라이프스타일을 잇는 가교입니다.
                                우리는 단순히 상품을 판매하는 것을 넘어, 문화를 경험하고 향유하는 새로운 방식을 제안합니다.
                            </p>
                            <p>
                                장인의 손길이 닿은 공예품부터, 지금 가장 핫한 전시와 공연까지.
                                당신의 일상에 특별한 영감을 불어넣을 이야기를 만나보세요.
                            </p>
                        </div>

                        <div className="mt-12">
                            <button className="text-dancheong-green hover:text-white border border-dancheong-green hover:bg-dancheong-green px-8 py-3 rounded-none transition-all duration-300">
                                브랜드 스토리 보기
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
