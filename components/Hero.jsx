import { useNavigate } from 'react-router-dom';

function Hero() {
    const navigate = useNavigate();

    return (
        <div className="hero">
            <h1>Rent movies anytime, anywhere</h1>
            <p>Vibe to a world of possibilities</p>
            <button onClick={() => navigate('/register')} className="start">Get Started</button>
        </div>
    );
}
export default Hero;