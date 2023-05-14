import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './routes/login/Login';
import { Layout } from './components/Layout';
import { LoginLayout } from './components/LoginLayout';
import { Signup } from './routes/signup/Signup';
import { Home } from './routes/home/Home';
import { Plugins } from './routes/plugins/Plugins';
import { Studies } from './routes/studies/Studies';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="plugins" element={<Plugins />} />
          <Route path="studies" element={<Studies />} />
          <Route path="auth" element={<LoginLayout />} >
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
          {/* <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
