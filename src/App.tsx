import { useEffect, useState } from 'react'
import './lessonSections.css'
import AccountPortal, { RoleDashboard, type User } from './Portal'

type Lesson = { id: string; title: string; description: string; video: string; notes: string; material: string }
type Subject = { id: string; icon: string; title: string; description: string; lessons: Lesson[] }

const subjects: Subject[] = [
  { id: 'mathematics', icon: '∑', title: 'Mathematics', description: 'Build strong problem-solving skills.', lessons: [
    { id: 'linear-equations', title: 'Linear equations in one variable', description: 'Solve everyday maths problems using simple equations.', video: '12 min concept video', notes: 'Step-by-step equation notes', material: 'Practice worksheet' },
    { id: 'geometry-basics', title: 'Understanding geometry', description: 'Learn the building blocks of angles, lines, and shapes.', video: '15 min concept video', notes: 'Geometry formula notes', material: 'Shape activity sheet' },
  ] },
  { id: 'science', icon: '⚗', title: 'Science', description: 'Explore the world through concepts and experiments.', lessons: [
    { id: 'force-pressure', title: 'Force and pressure', description: 'See how pushes and pulls change the world around us.', video: '14 min concept video', notes: 'Force and pressure notes', material: 'Quick experiment guide' },
    { id: 'cell-structure', title: 'Cell structure and function', description: 'Meet the tiny building blocks that make living things work.', video: '16 min concept video', notes: 'Cell diagram notes', material: 'Label-the-cell activity' },
  ] },
  { id: 'english', icon: 'Aa', title: 'English', description: 'Read, write, and express yourself with clarity.', lessons: [
    { id: 'reading-comprehension', title: 'Reading with understanding', description: 'Find ideas, clues, and meaning in a text.', video: '10 min concept video', notes: 'Reading strategy notes', material: 'Comprehension passage' },
    { id: 'writing-paragraphs', title: 'Writing strong paragraphs', description: 'Organise your ideas into clear and engaging paragraphs.', video: '13 min concept video', notes: 'Paragraph writing notes', material: 'Writing prompt pack' },
  ] },
  { id: 'sst', icon: '◎', title: 'SST', description: 'Connect history, geography, civics, and the world around you.', lessons: [
    { id: 'resources-development', title: 'Resources and development', description: 'Understand how people use and protect natural resources.', video: '13 min concept video', notes: 'Resource map notes', material: 'Map skills worksheet' },
    { id: 'indian-constitution', title: 'The Indian Constitution', description: 'Discover the values and ideas that guide our democracy.', video: '15 min concept video', notes: 'Constitution key points', material: 'Revision question set' },
  ] },
]

function LearningHome({ onDashboard }: { onDashboard: () => void }) {
  const [activeLesson, setActiveLesson] = useState<{ subject: Subject; lesson: Lesson } | null>(null)
  if (activeLesson) return <LessonDetail subject={activeLesson.subject} lesson={activeLesson.lesson} onBack={() => setActiveLesson(null)} />
  return <div className="site-shell">
    <header className="header"><a className="brand" href="#top" aria-label="Learnly home"><span className="brand-mark">L</span><span>learnly</span></a><nav className="nav" aria-label="Main navigation"><a href="#subjects">Subjects</a><a href="#how-it-works">How it works</a></nav><button className="button button-small" type="button" onClick={onDashboard}>Dashboard</button></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><p className="eyebrow">FOR CLASS 8, 9 &amp; 10</p><h1>Learn with clarity.<br /><em>Grow with confidence.</em></h1><p className="hero-text">A calm, focused learning space that helps you understand every topic, one step at a time.</p><div className="hero-actions"><a className="button" href="#subjects">Start exploring <span aria-hidden="true">→</span></a><a className="text-link" href="#how-it-works">See how it works</a></div><div className="trust-row" aria-label="Platform benefits"><span>✓ Clear lessons</span><span>✓ Learn at your pace</span><span>✓ Built for school</span></div></div><div className="hero-art" aria-label="Illustration of a student learning" role="img"><div className="sun" /><div className="arch arch-back" /><div className="arch arch-front" /><div className="study-card"><span className="card-spark">✦</span><div className="card-line line-long" /><div className="card-line" /><div className="card-line line-short" /></div><div className="student"><span className="student-head" /><span className="student-body" /></div><div className="plant"><i /><i /><i /></div></div></section>
      <section id="subjects" className="subjects section"><div className="section-heading"><p className="eyebrow">START WHERE YOU ARE</p><h2>Your favourite subjects, made simpler.</h2></div><div className="subject-grid">{subjects.map((subject) => <article className="subject-card" key={subject.id}><span className="subject-icon" aria-hidden="true">{subject.icon}</span><h3>{subject.title}</h3><p>{subject.description}</p><a href={`#${subject.id}-lessons`} aria-label={`Explore ${subject.title}`}>Explore <span aria-hidden="true">→</span></a></article>)}</div></section>
      <section className="lesson-sections section" aria-label="Subject lessons"><div className="lesson-intro"><p className="eyebrow">CHOOSE A CHAPTER</p><h2>Lessons to help you move forward.</h2><p>Open a chapter to find a clear video, notes, and study material.</p></div>{subjects.map((subject) => <article id={`${subject.id}-lessons`} className="subject-lessons" key={subject.id}><div className="subject-lessons-heading"><span className="subject-icon" aria-hidden="true">{subject.icon}</span><div><p className="eyebrow">{subject.title}</p><h2>{subject.title} lessons</h2></div></div><div className="lesson-card-grid">{subject.lessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} onOpen={() => setActiveLesson({ subject, lesson })} />)}</div></article>)}</section>
      <section id="how-it-works" className="how-it-works section"><div><p className="eyebrow">A BETTER STUDY ROUTINE</p><h2>Small steps make a big difference.</h2></div><ol><li><span>01</span><div><h3>Choose a topic</h3><p>Find a lesson that matches what you are learning in school.</p></div></li><li><span>02</span><div><h3>Learn at your pace</h3><p>Work through clear explanations and helpful examples.</p></div></li><li><span>03</span><div><h3>Feel ready</h3><p>Build confidence for class, homework, and exams.</p></div></li></ol></section>
    </main><footer><a className="brand" href="#top"><span className="brand-mark">L</span><span>learnly</span></a><p>Made for curious learners.</p></footer>
  </div>
}

function LessonCard({ lesson, onOpen }: { lesson: Lesson; onOpen: () => void }) {
  return <article className="lesson-card"><div className="video-placeholder"><span className="play-icon" aria-hidden="true">▶</span><span>Video lesson</span></div><div className="lesson-card-content"><h3>{lesson.title}</h3><p>{lesson.description}</p><div className="resource-list"><span>▣ {lesson.notes}</span><span>▤ {lesson.material}</span></div><button className="button lesson-button" type="button" onClick={onOpen}>Open Lesson <span aria-hidden="true">→</span></button></div></article>
}

function LessonDetail({ subject, lesson, onBack }: { subject: Subject; lesson: Lesson; onBack: () => void }) {
  return <div className="site-shell"><header className="header"><button className="back-button" type="button" onClick={onBack}>← All lessons</button><a className="brand" href="#top"><span className="brand-mark">L</span><span>learnly</span></a></header><main className="lesson-detail section"><p className="eyebrow">{subject.title} · CHAPTER LESSON</p><h1>{lesson.title}</h1><p className="hero-text">{lesson.description}</p><div className="lesson-detail-grid"><section className="detail-video"><span className="play-icon" aria-hidden="true">▶</span><div><strong>Lesson video</strong><span>{lesson.video}</span></div></section><aside className="lesson-resources"><h2>Study resources</h2><a href="#notes">▣ {lesson.notes}</a><a href="#material">▤ {lesson.material}</a></aside></div><section className="lesson-notes" id="notes"><p className="eyebrow">WHAT YOU WILL LEARN</p><h2>Learn the core idea, then make it your own.</h2><p>Use the video, notes, and study material in the order that feels right for you. This lesson area is ready for your full chapter content.</p></section></main></div>
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [view, setView] = useState<'dashboard' | 'learning'>('dashboard')

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((response) => response.ok ? response.json() : { user: null })
      .then((result: { user: User | null }) => setUser(result.user))
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false))
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => undefined)
    setUser(null)
    setView('dashboard')
    window.location.hash = 'account'
  }

  if (checkingSession) return <main className="portal section"><p className="eyebrow">SECURE SESSION</p><h2>Checking your account…</h2></main>
  if (!user) return <AccountPortal onAuthenticated={(nextUser) => { setUser(nextUser); setView('dashboard') }} />
  if (view === 'learning') return <LearningHome onDashboard={() => setView('dashboard')} />

  return <div className="site-shell"><header className="header"><a className="brand" href="#dashboard" aria-label="Learnly dashboard"><span className="brand-mark">L</span><span>learnly</span></a><button className="button button-small" type="button" onClick={() => setView('learning')}>Explore lessons</button></header><main className="portal section"><div className="portal-heading"><p className="eyebrow">YOUR LEARNLY SPACE</p><h2>Welcome, {user.displayName}.</h2><p>Your dashboard is matched to your role.</p></div><RoleDashboard user={user} onLogout={logout} /></main></div>
}

export default App
