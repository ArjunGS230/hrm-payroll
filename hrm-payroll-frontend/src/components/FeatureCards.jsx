const features = [
  {
    icon: "₹",
    title: "Salary Structure",
    description:
      "Configure basic salary, HRA, allowances, PF, ESI and professional tax."
  },
  {
    icon: "✓",
    title: "Leave Management",
    description:
      "Track casual, sick and earned leave with automated balance management."
  },
  {
    icon: "▣",
    title: "Payroll Processing",
    description:
      "Automatically calculate deductions, gross salary and net salary."
  },
  {
    icon: "PDF",
    title: "Payslip Automation",
    description:
      "Generate professional PDF payslips and send them directly through email."
  }
];

function FeatureCards() {

  return (
    <div className="feature-grid">

      {features.map((feature, index) => (

        <div
          className="feature-card"
          key={index}
        >

          <div className="feature-icon">
            {feature.icon}
          </div>

          <h3>
            {feature.title}
          </h3>

          <p>
            {feature.description}
          </p>

          <div className="feature-arrow">
            →
          </div>

        </div>

      ))}

    </div>
  );
}

export default FeatureCards;
