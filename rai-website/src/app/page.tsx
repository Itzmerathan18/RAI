'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {motion} from 'framer-motion';
import {FiArrowRight,FiArrowDown} from 'react-icons/fi';
import CountUp from 'react-countup';
import {useInView} from 'react-intersection-observer';
import {RobotArmLeft,RobotArmRight} from '@/components/ui/RobotArm';

const stats=[
  {label:'Faculty Members',value:45,suffix:'+',icon:'👨‍🏫'},
  {label:'Student Projects',value:350,suffix:'+',icon:'🤖'},
  {label:'Labs & Facilities',value:15,suffix:'+',icon:'🔬'},
  {label:'Research Areas',value:20,suffix:'+',icon:'🧠'},
  {label:'Publications',value:100,suffix:'+',icon:'📚'},
];

const research=[
  {icon:'🦾',title:'Industrial Robotics',desc:'Pick-and-place automation, robotic arms, PLC integration and factory floor systems.'},
  {icon:'👁',title:'Computer Vision',desc:'Object detection, YOLO, OpenCV and real-time visual intelligence for robots.'},
  {icon:'🧠',title:'AI & Machine Learning',desc:'Deep learning, reinforcement learning, GPU computing and neural networks.'},
  {icon:'🚗',title:'Autonomous Systems',desc:'Self-driving principles, SLAM, path planning, LiDAR and sensor fusion.'},
  {icon:'⚙️',title:'Industrial Automation',desc:'SCADA, IoT integration, Smart Manufacturing and Industry 4.0 protocols.'},
  {icon:'🤝',title:'Human-Robot Interaction',desc:'Collaborative robots (cobots), gesture recognition and safety systems.'},
];

const labs=[
  {title:'Robotics Lab',sub:'Industrial Arms & PLC'},
  {title:'AI & ML Lab',sub:'GPU Deep Learning'},
  {title:'Embedded Systems Lab',sub:'IoT & Microcontrollers'},
  {title:'Control Systems Lab',sub:'SCADA & Automation'},
  {title:'Computer Vision Lab',sub:'YOLO & OpenCV'},
];

const projects=[
  {title:'Autonomous Mobile Robot',cat:'Robotics',color:'from-cyan-900/60'},
  {title:'Pick & Place Robot',cat:'Automation',color:'from-blue-900/60'},
  {title:'AI Based Surveillance',cat:'AI/ML',color:'from-indigo-900/60'},
  {title:'Smart Agriculture Robot',cat:'IoT',color:'from-teal-900/60'},
];

function StatCard({s,i}:{s:typeof stats[0];i:number}){
  const {ref,inView}=useInView({triggerOnce:true});
  return(
    <motion.div ref={ref} initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.5,delay:i*0.08}} whileHover={{y:-5}}
      className="glass-card p-5 text-center border border-white/5 hover:border-cyan-500/30 hover:shadow-glow transition-all duration-300 group">
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{s.icon}</div>
      <div className="font-orbitron text-3xl font-black text-cyan-400 mb-1">
        {inView?<CountUp end={s.value} duration={2} suffix={s.suffix}/>:'0'}
      </div>
      <div className="text-xs text-white/40 uppercase tracking-wider font-rajdhani">{s.label}</div>
    </motion.div>
  );
}

export default function HomePage(){
  const [mounted,setMounted]=useState(false);
  const [dynStats, setDynStats] = useState(stats);
  const [dynResearch, setDynResearch] = useState<any[]>(research);
  const [dynLabs, setDynLabs] = useState<any[]>(labs);
  const [dynProjects, setDynProjects] = useState<any[]>(projects);

  useEffect(()=>{
    setMounted(true);
    // Fetch dynamic data
    const API = process.env.NEXT_PUBLIC_API_URL || '/api';
    Promise.all([
      fetch(`${API}/faculty`).then(r => r.json()).catch(() => null),
      fetch(`${API}/research`).then(r => r.json()).catch(() => null),
      fetch(`${API}/labs`).then(r => r.json()).catch(() => null),
      fetch(`${API}/projects`).then(r => r.json()).catch(() => null)
    ]).then(([fRes, rRes, lRes, pRes]) => {
       if (fRes?.data?.length > 0) {
           setDynStats(prev => {
               const newStats = [...prev];
               newStats[0].value = fRes.data.length; // Update faculty count
               return newStats;
           });
       }
       if (rRes?.data?.length > 0) setDynResearch(rRes.data);
       if (lRes?.data?.length > 0) setDynLabs(lRes.data);
       if (pRes?.data?.length > 0) setDynProjects(pRes.data);
    });
  },[]);

  return(
    <div className="min-h-screen overflow-x-hidden bg-black">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:'url(/images/jnnce-campus.jpeg)',opacity:0.08,filter:'grayscale(60%)'}}/>
        <div className="cyber-grid"/>
        <div className="orb w-[500px] h-[500px] bg-cyan-900" style={{top:'-100px',left:'-100px',opacity:0.1}}/>
        <div className="orb w-[350px] h-[350px] bg-blue-900" style={{bottom:'0',right:'-80px',opacity:0.08,animationDelay:'4s'}}/>
        <div className="absolute inset-0 pointer-events-none scan-line"/>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80 mix-blend-screen" style={{ top: '10%' }}>
            <img src="/images/robot-hero.png" alt="Futuristic Robot" className="w-[80vw] max-w-[800px] object-contain drop-shadow-[0_0_100px_rgba(234,179,8,0.5)] animate-pulse" style={{ animationDuration: '4s' }} />
        </div>

        {/* Floor glow */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500/20"/>
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{background:'linear-gradient(to top,rgba(0,229,255,0.04),transparent)'}}/>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-32 text-center w-full">
          <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
            <div className="w-20 h-20 rounded-full bg-white shadow-glow mx-auto mb-6 overflow-hidden flex items-center justify-center">
              <img src="/images/jnnce-logo.png" alt="JNNCE" className="w-18 h-18 object-contain"/>
            </div>
            <div className="section-label mx-auto w-fit mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"/>
              Est. 1980 · VTU Affiliated · NAAC A Grade
            </div>
          </motion.div>

          <motion.h1 initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{duration:0.8,delay:0.2}}
            className="font-orbitron font-black leading-none mb-2 drop-shadow-[0_3px_14px_rgba(0,0,0,0.85)]" style={{fontSize:'clamp(1.8rem,5.5vw,4rem)'}}>
            <span className="gradient-text">ROBOTICS &</span>
          </motion.h1>
          <motion.h1 initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{duration:0.8,delay:0.3}}
            className="font-orbitron font-black leading-none mb-3 drop-shadow-[0_3px_14px_rgba(0,0,0,0.85)]" style={{fontSize:'clamp(1.8rem,5.5vw,4rem)'}}>
            <span className="text-white font-extrabold tracking-[0.04em]">ARTIFICIAL INTELLIGENCE</span>
          </motion.h1>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}} className="cyber-line my-4 max-w-xs mx-auto"/>

          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.45}}
            className="font-rajdhani text-cyan-300/95 text-lg font-semibold tracking-[0.25em] uppercase mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            JNNCE, Shivamogga
          </motion.p>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
            className="font-rajdhani text-white/70 text-sm font-medium tracking-[0.18em] uppercase mb-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            Innovation &nbsp;|&nbsp; Automation &nbsp;|&nbsp; AI &nbsp;|&nbsp; Robotics
          </motion.p>

          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.55}}
            className="flex flex-wrap gap-4 justify-center mb-12">
            <Link href="/about" className="btn-primary">Explore Department <FiArrowRight/></Link>
            <Link href="/research" className="btn-secondary">View Research</Link>
          </motion.div>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.7}}
            className="flex flex-wrap justify-center gap-8">
            {[{val:'60',label:'Intake/Year'},{val:'B.E.',label:'4-Year Programme'},{val:'5',label:'Research Labs'},{val:'90%',label:'Placement Rate'}].map(b=>(
              <div key={b.label} className="text-center">
                <div className="font-orbitron text-cyan-300 text-lg font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">{b.val}</div>
                <div className="text-white/55 text-xs tracking-wider uppercase font-rajdhani font-semibold">{b.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.a href="#about" animate={{y:[0,8,0]}} transition={{repeat:Infinity,duration:2}}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 flex flex-col items-center gap-1 hover:text-cyan-400 transition-colors z-10">
          <span className="text-xs font-orbitron tracking-widest uppercase">Scroll</span>
          <FiArrowDown/>
        </motion.a>
      </section>

      {/* ABOUT JNNCE */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.6}}>
            <div className="section-label mb-6">About JNNCE</div>
            <h2 className="section-title text-3xl text-white mb-5">About Jawaharlal Nehru National College of Engineering</h2>
            <p className="text-white/75 leading-relaxed mb-4 font-rajdhani text-lg font-medium">
              JNNCE, established in <strong className="text-cyan-400">1980</strong>, is a premier government engineering institution committed to academic excellence, innovation and holistic development of students in Shivamogga, Karnataka.
            </p>
              <p className="text-white/75 leading-relaxed mb-6 font-rajdhani text-lg font-medium">
              Affiliated to <strong className="text-white">VTU, Belagavi</strong> and accredited with <strong className="text-cyan-400">NAAC A Grade</strong>, the college is a top performer in the region with 66 Mbps campus internet and world-class infrastructure.
            </p>
            <Link href="/about" className="btn-secondary text-sm">Know More <FiArrowRight/></Link>
          </motion.div>
          <motion.div initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.6}} className="grid grid-cols-2 gap-3">
            {[{src:'/images/jnnce-campus.jpeg',id:'campus'},{src:'/images/rai-sign-entrance.jpeg',id:'entrance'},{src:'/images/rai-sign-corridor.png',id:'corridor'},{src:'/images/jnnce-campus.jpeg',id:'campus2'}].map((img)=>(
              <div key={img.id} className="rounded-xl overflow-hidden border border-white/8 hover:border-cyan-500/30 transition-all aspect-video group">
                <img src={img.src} alt="JNNCE" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"/>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* DEPARTMENT OVERVIEW */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="section-label mb-6">Department Overview</div>
            <h2 className="section-title text-2xl text-white mb-6">Robotics & Artificial Intelligence Department</h2>
            <p className="text-white/75 font-rajdhani text-lg mb-8 leading-relaxed font-medium">
              Established in 2020, the Department focuses on cutting-edge research and developing intelligent systems for real-world applications across Industry 4.0.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                {icon:'🎯',title:'Vision',desc:'To be a leading centre for robotics and AI education, research and innovation.'},
                {icon:'🚀',title:'Mission',desc:'To nurture innovation, skill and ethical technology for societal advancement.'},
              ].map(card=>(
                <motion.div key={card.title} whileHover={{y:-4}} className="glass-card p-5 border border-white/8 hover:border-cyan-500/30 hover:shadow-glow transition-all">
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <h3 className="font-orbitron text-sm text-cyan-400 mb-2">{card.title}</h3>
                  <p className="text-xs text-white/50 font-rajdhani leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div initial={{opacity:0,scale:0.95}} whileInView={{opacity:1,scale:1}} viewport={{once:true}}
            className="flex items-center justify-center">
            <div className="relative w-72 h-72">
              <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-spin" style={{animationDuration:'20s'}}/>
              <div className="absolute inset-4 rounded-full border border-cyan-500/15 animate-spin" style={{animationDuration:'15s',animationDirection:'reverse'}}/>
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-950/50 to-black border border-cyan-500/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">🤖</div>
                  <div className="font-orbitron text-xs text-cyan-400 uppercase tracking-widest">AI Powered</div>
                </div>
              </div>
              {[{deg:0,id:'joint-0'},{deg:60,id:'joint-1'},{deg:120,id:'joint-2'},{deg:180,id:'joint-3'},{deg:240,id:'joint-4'},{deg:300,id:'joint-5'}].map((joint,i)=>(
                <div key={joint.id} className="absolute w-2 h-2 rounded-full bg-cyan-400" style={{
                  top:'50%',left:'50%',
                  transform:`rotate(${joint.deg}deg) translateX(130px) translateY(-4px)`,
                  animation:`joint-pulse 2s ease-in-out ${i*0.3}s infinite`,
                  boxShadow:'0 0 8px #00E5FF'
                }}/>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* RESEARCH AREAS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-14">
          <div className="section-label mx-auto w-fit mb-4">Research Focus</div>
          <h2 className="section-title text-3xl text-white mb-3">Core Research <span className="gradient-text-static">Areas</span></h2>
            <p className="text-white/65 font-rajdhani text-lg font-medium">Active projects funded by VTU, DST-SERB, DRDO and AICTE</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dynResearch.map((r: any, i)=>(
            <motion.div key={r.title} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
              transition={{duration:0.4,delay:i*0.09}} viewport={{once:true}}
              className="glass-card research-card p-6 border border-white/5 cursor-default group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{r.icon}</div>
              <h3 className="font-orbitron font-bold text-sm text-cyan-400 mb-2 uppercase tracking-wider">{r.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed font-rajdhani">{r.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/research" className="btn-secondary text-sm">View All Research <FiArrowRight/></Link>
        </div>
      </section>

      {/* LABS HIGHLIGHT */}
      <section className="py-20" style={{background:'linear-gradient(180deg,transparent,rgba(0,229,255,0.02),transparent)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-12">
            <div className="section-label mx-auto w-fit mb-4">Infrastructure</div>
            <h2 className="section-title text-3xl text-white mb-3">Labs <span className="gradient-text-static">Highlight</span></h2>
            <p className="text-white/65 font-rajdhani text-lg font-medium">State-of-the-art laboratories for hands-on learning</p>
          </motion.div>
          <div className="labs-scroll pb-2">
            {dynLabs.map((lab: any, i)=>(
              <motion.div key={lab.title} initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}}
                transition={{delay:i*0.1}} viewport={{once:true}}
                className="labs-scroll-item w-64 glass-card border border-white/8 hover:border-cyan-500/30 hover:shadow-glow transition-all group cursor-default overflow-hidden">
                <div className="h-36 bg-gradient-to-br from-cyan-950/40 to-black flex items-center justify-center border-b border-white/5">
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🔬</div>
                </div>
                <div className="p-4">
                  <h3 className="font-orbitron text-xs text-white uppercase tracking-wider mb-1">{lab.title}</h3>
                  <p className="text-xs text-cyan-400/70 font-rajdhani">{lab.sub}</p>
                </div>
              </motion.div>
            ))}
            <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}
              className="labs-scroll-item w-48 glass-card border border-cyan-500/20 flex flex-col items-center justify-center p-6 cursor-pointer hover:shadow-glow transition-all group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">➡️</div>
              <Link href="/labs" className="font-orbitron text-xs text-cyan-400 uppercase tracking-wider text-center">View All Labs</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STUDENT PROJECTS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-14">
          <div className="section-label mx-auto w-fit mb-4">Student Work</div>
          <h2 className="section-title text-3xl text-white mb-3">Student <span className="gradient-text-static">Projects</span></h2>
          <p className="text-white/65 font-rajdhani text-lg font-medium">Innovative solutions built by our engineering students</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {dynProjects.map((p: any, i)=>(
            <motion.div key={p.title} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
              transition={{delay:i*0.1}} viewport={{once:true}}
              className="project-card aspect-[4/5] border border-white/8 hover:border-cyan-500/30 group cursor-default"
              style={{background:'linear-gradient(135deg,#0d1520,#000)'}}>
              <div className={`absolute inset-0 bg-gradient-to-t ${p.color} to-transparent`}/>
              <div className="project-card-overlay"/>
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <span className="badge-cyber badge text-[10px] w-fit mb-2">{p.cat}</span>
                <h3 className="font-orbitron text-xs text-white uppercase tracking-wider leading-snug">{p.title}</h3>
              </div>
              <div className="absolute top-4 right-4 text-3xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all">
                {i===0?'🤖':i===1?'🦾':i===2?'📷':'🌱'}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/projects" className="btn-secondary text-sm">View All Projects <FiArrowRight/></Link>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-14">
          <div className="section-label mx-auto w-fit mb-4">By the Numbers</div>
          <h2 className="section-title text-3xl text-white mb-3">Numbers That Define <span className="gradient-text-static">Excellence</span></h2>
          <p className="text-white/65 font-rajdhani text-lg font-medium">JNNCE RAI · Building intelligent engineers since 2020</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {dynStats.map((s,i)=><StatCard key={s.label} s={s} i={i}/>)}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-14">
          <div className="section-label mx-auto w-fit mb-4">Media</div>
          <h2 className="section-title text-3xl text-white mb-3">Gallery <span className="gradient-text-static">Preview</span></h2>
          <p className="text-white/65 font-rajdhani text-lg font-medium">Glimpses of lab work, events and achievements</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {[
            {src:'/images/jnnce-campus.jpeg',span:'col-span-2 md:col-span-1',rows:'',id:'gal-1'},
            {src:'/images/rai-sign-entrance.jpeg',span:'',rows:'',id:'gal-2'},
            {src:'/images/rai-sign-corridor.png',span:'',rows:'',id:'gal-3'},
            {src:'/images/jnnce-campus.jpeg',span:'',rows:'',id:'gal-4'},
            {src:'/images/rai-sign-entrance.jpeg',span:'',rows:'',id:'gal-5'},
            {src:'/images/rai-sign-corridor.png',span:'col-span-2 md:col-span-1',rows:'',id:'gal-6'},
          ].map((img,i)=>(
            <motion.div key={img.id} initial={{opacity:0,scale:0.95}} whileInView={{opacity:1,scale:1}}
              transition={{delay:i*0.07}} viewport={{once:true}}
              className={`${img.span} rounded-xl overflow-hidden border border-white/8 hover:border-cyan-500/30 transition-all group aspect-video`}>
              <img src={img.src} alt={`Gallery ${i+1}`} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"/>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/gallery" className="btn-primary">View Gallery <FiArrowRight/></Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="glass-card-cyan p-12 text-center relative overflow-hidden">
          <div className="cyber-grid absolute inset-0 opacity-40"/>
          <div className="relative z-10">
            <div className="font-orbitron text-cyan-400 text-xs uppercase tracking-widest mb-3">Join the Future of Engineering</div>
            <h2 className="section-title text-2xl text-white mb-4">Ready to Build Intelligent Machines?</h2>
            <p className="text-white/70 mb-8 max-w-lg mx-auto font-rajdhani text-lg font-medium">
              Contact us for admissions, research collaborations or industry partnerships with the Dept. of Robotics & AI at JNNCE.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-primary">Contact Department <FiArrowRight/></Link>
              <Link href="/about" className="btn-secondary">Learn More</Link>
            </div>
            <div className="mt-6 text-xs text-white/45 font-rajdhani font-medium tracking-wide">
              📍 JNNCE, Navule, Savalanga Road, Shivamogga – 577201 &nbsp;|&nbsp; 📞 08182-225341 &nbsp;|&nbsp; ✉ rai@jnnce.ac.in
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
