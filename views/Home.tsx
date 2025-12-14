import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Grid3X3, Activity, Eye, BookOpen, Hexagon, Maximize2 } from 'lucide-react';

const TestCard = ({ title, desc, icon: Icon, path, color }: { title: string; desc: string; icon: any; path: string; color: string }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(path)}
      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all active:scale-95 flex items-start gap-4"
    >
      <div className={`p-3 rounded-xl ${color} text-white`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="font-bold text-lg text-slate-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <Layout title="تست‌های بینایی ماکولا" showBack={false}>
      <div className="space-y-4 py-2">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
          <p className="text-blue-800 text-sm font-medium leading-6">
            لطفاً برای انجام تست‌ها، در صورت نیاز عینک مطالعه خود را بزنید و گوشی را در فاصله ۳۰ تا ۴۰ سانتی‌متری نگه دارید.
          </p>
        </div>

        <TestCard 
          title="تست آمسلر (Amsler)" 
          desc="بررسی عملکرد ماکولا و تشخیص کجی خطوط یا لکه‌های تیره."
          icon={Grid3X3}
          path="/amsler"
          color="bg-blue-500"
        />
        
        <TestCard 
          title="تست PHP" 
          desc="تست هایپرکیوتی برای تشخیص انحراف‌های ظریف."
          icon={Activity}
          path="/php"
          color="bg-teal-500"
        />

        <TestCard 
          title="تست SDH" 
          desc="تشخیص لکه‌های کور و خلأ در دید مرکزی."
          icon={Hexagon}
          path="/sdh"
          color="bg-indigo-500"
        />

        <TestCard 
          title="تست M-Chart" 
          desc="سنجش متامورفوپسی (کجی دید) با خطوط نقطه‌چین."
          icon={Maximize2}
          path="/mchart"
          color="bg-orange-500"
        />

        <TestCard 
          title="میدان مرکزی (Central Field)" 
          desc="بررسی حساسیت در نقاط مختلف میدان مرکزی."
          icon={Eye}
          path="/central-field"
          color="bg-rose-500"
        />

        <TestCard 
          title="سرعت خواندن (Reading)" 
          desc="سنجش سرعت خواندن جهت بررسی کارایی دید نزدیک."
          icon={BookOpen}
          path="/reading"
          color="bg-emerald-500"
        />
      </div>
    </Layout>
  );
};

export default Home;