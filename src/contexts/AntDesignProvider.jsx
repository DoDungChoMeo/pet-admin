import 'antd/dist/antd.variable.min.css';
import { ConfigProvider } from 'antd';
ConfigProvider.config({
  theme: {
    primaryColor: '#3b82f6',
  },
});

function AntDesignProvider({ children }) {
  return <ConfigProvider>{children}</ConfigProvider>;
}

export default AntDesignProvider;
