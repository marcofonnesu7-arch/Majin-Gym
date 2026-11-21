import React, { useEffect, useState } from 'react';
import { Dumbbell, Flame, LayoutDashboard, RotateCcw, Play, Square, ChevronRight, Palette, ArrowLeft, TrendingUp, UserRound } from 'lucide-react';

const VEGETA = 'https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?auto=format&fit=crop&w=1200&q=85';

const exercises = [
  { name: 'Panca Inclinata 30° Bilanciere', sets: '3', reps: '6-8', rest: "3'", intensity: 'ALTA', color: 'red', note: 'Stop 2cm dal petto, no blocco articolare.', extra: 'Ultima REST-PAUSE', history: '67.5 kg' },
  { name: 'Chest Press Inclinata / Panca 45° Manubri', sets: '3', reps: '8-10', rest: "2'", intensity: 'MEDIA', color: 'yellow', note: 'Eccentrica 3s controllata, concentrica esplosiva.', extra: 'RIR 0', history: '30 kg' },
  { name: 'Croci ai Cavi Basso-Alto', sets: '3', reps: '12-15', rest: '90"', intensity: 'BASSA', color: 'green', note: 'Focus petto clavicolare.', extra: 'Ultima DROP SET', history: '14 kg' },
  { name: 'Spinte MPW', sets: '5', reps: '5', rest: '90"', intensity: 'MEDIA', color: 'yellow', note: 'Progressivo ogni serie.', extra: 'RIR 1', history: '9 kg' },
  { name: 'Pushdown Barra', sets: '2+1', reps: '8-10', rest: "2'", intensity: 'MEDIA', color: 'yellow', note: 'Gomiti vicini ai fianchi, spalle ferme.', extra: 'RIR 1', history: '54 kg' },
  { name: 'Pushdown ai Cavi con Corda', sets: '3', reps: '12-15', rest: '60"', intensity: 'BASSA', color: 'green', note: 'Apri la corda verso l’esterno con hold isometrico.', extra: 'RIR 0', history: '16 kg' },
];

const storage = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function App() {
  const [tab, setTab] = useState('today');
  const [exercise, setExercise] = useState(0);
  const [seconds, setSeconds] = useState(180);
  const [running, setRunning] = useState(false);
  const [series, setSeries] = useState(1);
  const [profile, setProfile] = useState(() => storage.get('profile', { name: 'Marco', age: '', height: 175, weight: 74.4, fat: 18, sex: 'Maschio', goal: 'Ipertrofia Muscolare Avanzata', bodyFat: 18, muscle: 35, skeletal: 32, water: 55, bmr: 1372 }));
  const [background, setBackground] = useState(() => storage.get('background', VEGETA));

  useEffect(() => storage.set('profile', profile), [profile]);
  useEffect(() => storage.set('background', background), [background]);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(value => {
      if (value <= 1) { setRunning(false); return 0; }
      return value - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [running]);

  const heightMeters = Number(profile.height) / 100;
  const bmi = heightMeters > 0 && Number(profile.weight) > 0 ? Number(profile.weight) / (heightMeters * heightMeters) : null;
  const selected = exercises[exercise];

  function changeBackground(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBackground(reader.result);
    reader.readAsDataURL(file);
  }

  function registerSeries() {
    const entry = { date: new Date().toISOString(), exercise: selected.name, series, weight: selected.history };
    const history = storage.get('history', []);
    storage.set('history', [entry, ...history]);
    setSeries(value => Math.min(value + 1, Number(selected.sets) || 3));
  }

  function nextExercise() {
    setExercise(value => (value + 1) % exercises.length);
    setSeries(1);
    setSeconds(180);
    setRunning(false);
  }

  return (
    <main className="app" style={{ '--cover': `url(${background})` }}>
      <div className="phone">
        {tab === 'today' && (
          <section className="screen">
            <header className="hero">
              <div className="heroShade" />
              <div className="palette"><label><Palette size={24} /><input type="file" accept="image/*" onChange={changeBackground} /></label></div>
              <div className="brand"><b>M</b><span>MAJIN GYM</span></div>
              <div className="greeting"><h1>Ciao, {profile.name}</h1><p>sabato 21 novembre</p></div>
            </header>

            <h2 className="sectionLabel">OGGI</h2>
            <article className="restCard"><div className="moon">◔</div><h3>Giorno di Riposo</h3><p>Il tuo potere si rigenera. Torna lunedì.</p></article>

            <h2 className="sectionLabel">METRICHE</h2>
            <div className="metricGrid">
              <div><span>OGGI</span><strong>{profile.weight}</strong><small>kg</small></div>
              <div><span>BMI</span><strong>{bmi?.toFixed(1) ?? '—'}</strong></div>
            </div>
          </section>
        )}

        {tab === 'schedule' && (
          <section className="screen">
            <h1 className="pageTitle">SCHEDA</h1><p className="subTitle">Il tuo programma personalizzato</p>
            <div className="days">{['Lunedì','Martedì','Mercoledì','Giovedì'].map((day, i) => <button className={i === 0 ? 'active' : ''} key={day}>{day}</button>)}</div>
            <h2 className="pinkTitle">Lunedì — Push</h2>
            <div className="exerciseList">
              {exercises.map((item, i) => (
                <button className="exerciseRow" key={item.name} onClick={() => { setExercise(i); setTab('today'); }}>
                  <i className={item.color} />
                  <div><strong>{item.name}</strong><p>{item.sets} × {item.reps} · Rec {item.rest} <em className={item.color}>{item.intensity}</em></p></div>
                  <ChevronRight />
                </button>
              ))}
            </div>
          </section>
        )}

        {tab === 'diary' && (
          <section className="screen">
            <h1 className="pageTitle">DIARIO</h1><p className="subTitle">Le tue sessioni e progressioni</p>
            <article className="chartCard"><div className="chartHead"><TrendingUp /><strong>Progressi</strong></div><div className="bars">{[45,70,58,82,74,92,88].map((v,i)=><i key={i} style={{height:`${v}%`}} />)}</div></article>
            <h2 class="pinkTitle">Storico recente</h2>
            {(storage.get('history', [])).map((item,i)=><article className="historyRow" key={i}><div><strong>{item.exercise}</strong><p>{new Date(item.date).toLocaleDateString('it-IT')}</p></div><b>{item.weight}</b></article>)}
            {!storage.get('history', []).length && <article className="historyRow"><div><strong>Nessuna serie registrata</strong><p>Inizia un allenamento</p></div></article>}
          </section>
        )}

        {tab === 'profile' && (
          <section className="screen profileScreen">
            <div className="profileHero" style={{ backgroundImage: `linear-gradient(0deg, rgba(5,5,20,.98), rgba(5,5,20,.15)), var(--cover)` }}><b>M</b><h1>{profile.name}</h1><p>{profile.goal}</p></div>
            <label className="backgroundButton"><Palette /> MODIFICA NOME E SFONDO<input type="file" accept="image/*" onChange={changeBackground} /></label>
            <article className="bmiCard"><p>BMI</p><strong>{bmi?.toFixed(1) ?? '—'}</strong><span>Peso / Altezza² (m)</span></article>
            <div className="profileGrid">
              {[
                ['PESO', profile.weight, 'kg'], ['GRASSO', profile.fat, '%'], ['MASSA GRASSA', profile.weight * profile.fat / 100, 'kg'], ['MASSA MAGRA', profile.weight * (100-profile.fat)/100, 'kg'], ['MUSCOLI', profile.muscle, 'kg'], ['SCHELETRICI', profile.skeletal, 'kg'], ['ACQUA', profile.water, '%'], ['BMR', profile.bmr, 'kcal']
              ].map(([label,value,unit]) => <div key={label}><span>{label}</span><strong>{typeof value === 'number' ? value.toFixed(unit === 'kg' && label === 'PESO' ? 1 : 1) : value}</strong><small>{unit}</small></div>)}
            </div>
            <h2 className="pinkTitle">OBIETTIVO</h2>
            <div className="form">
              <label>Nome<input value={profile.name} onChange={e => setProfile(p => ({...p, name:e.target.value}))}/></label>
              <label>Età<input type="number" value={profile.age} onChange={e => setProfile(p => ({...p, age:e.target.value}))}/></label>
              <label>Altezza (cm)<input type="number" min="100" max="250" value={profile.height} onChange={e => setProfile(p => ({...p, height:Number(e.target.value)}))}/></label>
              <label>Peso (kg)<input type="number" min="30" max="300" step="0.1" value={profile.weight} onChange={e => setProfile(p => ({...p, weight:Number(e.target.value)}))}/></label>
              <label>Sesso<select value={profile.sex} onChange={e => setProfile(p => ({...p, sex:e.target.value}))}><option>Maschio</option><option>Femmina</option><option>Altro</option></select></label>
              <label>Grasso (%)<input type="number" value={profile.fat} onChange={e => setProfile(p => ({...p, fat:Number(e.target.value)}))}/></label>
              <label>Obiettivo<select value={profile.goal} onChange={e => setProfile(p => ({...p, goal:e.target.value}))}><option>Ipertrofia Muscolare Avanzata</option><option>Dimagrimento</option><option>Mantenimento</option><option>Forza</option></select></label>
            </div>
          </section>
        )}

        {tab === 'today' && false}

        <nav>
          <button className={tab === 'today' ? 'active' : ''} onClick={() => setTab('today')}><Flame /><span>Oggi</span></button>
          <button className={tab === 'schedule' ? 'active' : ''} onClick={() => setTab('schedule')}><Dumbbell /><span>Scheda</span></button>
          <button className={tab === 'diary' ? 'active' : ''} onClick={() => setTab('diary')}><LayoutDashboard /><span>Diario</span></button>
          <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}><UserRound /><span>Profilo</span></button>
        </nav>

        {tab === 'today' && (
          <section className="workoutModal">
            <div className="modalHead"><button onClick={() => setTab('schedule')}>×</button><span>Esercizio {exercise+1} di {exercises.length}</span></div>
            <div className="exerciseDetail"><i className={selected.color} /><div><h2>{selected.name}</h2><p>{selected.sets} × {selected.reps} · Rec {selected.rest} <em className={selected.color}>{selected.intensity}</em></p>{selected.extra && <b>{selected.extra}</b>}<p className="note">{selected.note}</p><small>Storico: {selected.history}</small></div></div>
            <article className="timerCard"><p>RECUPERO</p><strong>{formatTime(seconds)}</strong><div><button className="start" onClick={() => setRunning(!running)}>{running ? <Square /> : <Play fill="currentColor" />}{running ? 'PAUSA' : 'AVVIA'}</button><button onClick={() => setSeconds(180)}><RotateCcw /></button><button onClick={() => setSeconds(v => v + 15)}>+15s</button></div></article>
            <div className="setsHead">SERIE #{series} / {selected.sets}<div><span>KG</span><span>REPS</span><span>RIR</span></div></div>
            <div className="setInputs"><input type="number" placeholder="kg" /><input type="number" placeholder="reps" /><input type="number" placeholder="RIR" /></div>
            <button className="register" onClick={registerSeries}>✓ REGISTRA SERIE</button>
            <button className="next" onClick={nextExercise}>PROSSIMO ESERCIZIO <ChevronRight /></button>
          </section>
        )}
      </div>
    </main>
  );
}
