# ExpenseFlow - Odoo-Inspired Expense Management System

A modern, professional expense management application built with React and designed to seamlessly integrate with the Odoo ecosystem. Features role-based access control, OCR receipt processing, real-time currency conversion, and intelligent approval workflows.

![ExpenseFlow Logo](public/AuthentiFiLogo.png)

## 🚀 Features

### 👥 **Multi-Role Support**
- **Employees**: Create, submit, and track expenses
- **Managers**: Review and approve expense requests
- **Admins**: Configure approval rules and manage workflows

### 📱 **Core Functionality**
- **Smart Receipt Upload**: OCR processing with automatic data extraction
- **Real-time Currency Conversion**: Multi-currency support with live rates
- **Intelligent Approval Workflows**: Configurable rules and sequential/parallel approvals
- **Professional Dashboard**: Clean, Odoo-inspired design with comprehensive analytics
- **Mobile-Responsive**: Works perfectly on all devices

### 🎨 **Design System**
- **Odoo-Inspired UI**: Clean, professional interface matching Odoo's design language
- **Consistent Color Palette**: Blue primary (#2563eb) with proper status colors
- **Modern Typography**: Inter font family throughout
- **Accessible Design**: WCAG compliant with proper contrast and navigation

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **OCR**: Tesseract.js
- **Currency**: Real-time conversion API
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shams2808/expense-management-odoo.git
   cd expense-management-odoo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Sidebar.jsx     # Navigation sidebar
├── contexts/           # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── ExpensesContext.jsx # Expense management state
├── pages/              # Application pages
│   ├── LandingPage.jsx # Homepage
│   ├── SignIn.jsx      # User authentication
│   ├── SignUp.jsx      # User registration
│   ├── Dashboard.jsx   # Role-based redirector
│   ├── EmployeeDashboard.jsx # Employee expense management
│   ├── ManagerView.jsx # Manager approval interface
│   ├── AdminApprovalRules.jsx # Admin rule configuration
│   └── NewExpense.jsx  # Expense creation form
├── utils/              # Utility functions
│   └── currency.js     # Currency conversion
└── App.jsx            # Main application component
```

## 🎯 User Roles & Permissions

### 👤 **Employee**
- Create and submit expense reports
- Upload receipts with OCR processing
- Track expense status and history
- View personal expense analytics

### 👨‍💼 **Manager**
- Review pending expense requests
- Approve or reject expenses
- View team expense analytics
- Access approval history

### 👨‍💻 **Admin**
- Configure approval rules and workflows
- Manage user roles and permissions
- Set up currency conversion settings
- Access organization-wide analytics

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=your_api_url
VITE_CURRENCY_API_KEY=your_currency_api_key
VITE_OCR_API_KEY=your_ocr_api_key
```

### Currency Conversion
The application uses real-time currency conversion. Update the API endpoint in `src/utils/currency.js` to use your preferred currency service.

## 📱 Usage

### Creating an Expense
1. Navigate to "New Expense" from the sidebar
2. Upload a receipt or fill in details manually
3. Select category, amount, and payment method
4. Add remarks and submit for approval

### Managing Approvals (Managers)
1. Go to "Approvals" dashboard
2. Review pending expense requests
3. Click "Approve" or "Reject" with optional comments
4. Track approval history

### Configuring Rules (Admins)
1. Access "Approval Rules" from admin dashboard
2. Create new rules for specific users or categories
3. Set up approver sequences and requirements
4. Configure minimum approval percentages

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Odoo** for the design inspiration and ecosystem integration
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set

## 📞 Support

For support, email support@expenseflow.com or create an issue in this repository.

---

**ExpenseFlow** - Streamlining expense management with Odoo's professional touch. 🎉