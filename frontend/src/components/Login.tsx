import React, { useState, useEffect } from "react";
import { login } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { trace } from "firebase/performance";
import { performance } from "../firebase/firebaseConfig";
import { getFirestore, collection, addDoc, increment, updateDoc, doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { ArrowRight, Mail, Lock, Loader, Check, AlertCircle } from "lucide-react";

const db = getFirestore();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formActive, setFormActive] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setFormActive(true);
  }, []);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    setIsValidPassword(password.length >= 6);
  }, [password]);

  const logMetrics = async (isSuccessful, responseTime) => {
    if (responseTime === undefined) {
      console.error("Invalid responseTime: undefined");
      return;
    }
  
    const metricsDocRef = doc(db, "apiMetrics", "login-metrics");
  
    try {
      const docSnapshot = await getDoc(metricsDocRef);
  
      if (docSnapshot.exists()) {
        await updateDoc(metricsDocRef, {
          totalCalls: increment(1),
          failedCalls: isSuccessful ? increment(0) : increment(1),
          responseTimes: arrayUnion(responseTime),
        });
      } else {
        await setDoc(metricsDocRef, {
          totalCalls: 1,
          failedCalls: isSuccessful ? 0 : 1,
          responseTimes: [responseTime],
          metricName: "login-api",
        });
      }
    } catch (err) {
      console.error("Error updating or creating metrics:", err);
    }
  };

  const logErrorToFirestore = async (errorMessage, responseTime) => {
    const errorsCollectionRef = collection(db, "loginErrors");
    try {
      await addDoc(errorsCollectionRef, {
        errorMessage,
        timestamp: new Date(),
        responseTime,
      });
    } catch (err) {
      console.error("Error logging error to Firestore:", err);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isValidEmail || !isValidPassword) return;
    
    setLoading(true);
    setError("");
  
    const loginTrace = trace(performance, "login-api-trace");
    loginTrace.start();
    
    const startTime = Date.now();
  
    try {
      const { token } = await login(email, password);
      console.log("Token:", token);
      localStorage.setItem("authToken", token);
      const responseTime = Date.now() - startTime;
      await logMetrics(true, responseTime);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/", { state: { token } });
      }, 1000);
    } catch (err) {
      const responseTime = Date.now() - startTime;
      await logMetrics(false, responseTime);
      
      if (err instanceof Error) {
        setError(err.message || "Failed to log in. Please try again.");
        await logErrorToFirestore(err.message, responseTime);
      } else {
        setError("An unknown error occurred.");
        await logErrorToFirestore("An unknown error occurred.", responseTime);
      }
    } finally {
      loginTrace.stop();
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 transition-all duration-1000">
      <div 
        className={`w-full max-w-md transform transition-all duration-700 ease-out ${
          formActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="relative bg-white backdrop-blur-lg bg-opacity-90 shadow-2xl rounded-3xl p-8 space-y-6">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-3xl -z-10 animate-gradient-x"></div>
          
          <div className="space-y-2 text-center transform transition-all duration-500">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-500">Sign in to your account</p>
          </div>

          {error && (
            <div className="transform transition-all duration-300 animate-shake">
              <div className="flex items-center space-x-2 text-red-500 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail 
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedInput === 'email' ? 'text-blue-500' : 'text-gray-400'
                  }`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput('')}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl outline-none transition-all duration-300 
                    ${focusedInput === 'email' ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}
                    ${isValidEmail && email ? 'border-green-500 bg-green-50/30' : ''}`}
                  placeholder="Email address"
                  required
                />
                {email && (
                  <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    isValidEmail ? 'text-green-500 scale-100' : 'text-red-500 scale-100'
                  }`}>
                    {isValidEmail ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </div>
                )}
              </div>

              <div className="relative group">
                <Lock 
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedInput === 'password' ? 'text-blue-500' : 'text-gray-400'
                  }`}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput('')}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl outline-none transition-all duration-300 
                    ${focusedInput === 'password' ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}
                    ${isValidPassword && password ? 'border-green-500 bg-green-50/30' : ''}`}
                  placeholder="Password"
                  required
                />
                {password && (
                  <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    isValidPassword ? 'text-green-500 scale-100' : 'text-red-500 scale-100'
                  }`}>
                    {isValidPassword ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isValidEmail || !isValidPassword}
              className={`group relative w-full py-4 text-white font-semibold rounded-xl 
                transition-all duration-300 overflow-hidden
                ${loading || !isValidEmail || !isValidPassword 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600'
                }
                ${showSuccess ? 'bg-green-500' : ''}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`flex items-center justify-center space-x-2 transition-all duration-300 transform
                  ${loading ? 'scale-100' : 'scale-0'}`}>
                  <Loader className="w-5 h-5 animate-spin" />
                </div>
                <div className={`flex items-center justify-center space-x-2 transition-all duration-300 transform
                  ${showSuccess ? 'scale-100' : 'scale-0'}`}>
                  <Check className="w-5 h-5" />
                </div>
                <span className={`absolute flex items-center transition-all duration-300 transform
                  ${loading || showSuccess ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
                  <span className="mr-2">Sign in</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <a 
              href="https://firebase-admin-dashboard-v6q5.onrender.com/signup" 
              className="relative inline-block text-blue-500 hover:text-blue-600 font-medium transition-colors duration-300"
            >
              <span className="relative z-10">Sign up</span>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></div>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;