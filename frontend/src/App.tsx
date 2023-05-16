import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './routes/login/Login';
import { Layout } from './components/Layout';
import { LoginLayout } from './components/LoginLayout';
import { Signup } from './routes/signup/Signup';
import { Home } from './routes/home/Home';
import { Plugins } from './routes/plugins/Plugins';
import { Studies } from './routes/studies/Studies';
import { FastCompareCreate } from './routes/plugins/fastcompare/Create';
import { NotFound } from './routes/NotFound';
import { Join } from './routes/Join';
import { PreferenceElicitation } from './routes/studies/PreferenceElicitation';
import { CompareAlgorithms } from './routes/studies/CompareAlgorithms';
import { Finish } from './routes/studies/Finish';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="administration" element={<Home />} />
          <Route path="plugins" element={<Plugins />} />
          <Route path="studies" element={<Studies />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="utils/join" element={<Join />} />
          <Route path="utils/preference-elicitation" element={<PreferenceElicitation />} />
          <Route path="utils/finish" element={<Finish />} />
          <Route path="fastcompare/create" element={<FastCompareCreate />} />
          <Route path="fastcompare/compare-algorithms" element={<CompareAlgorithms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
