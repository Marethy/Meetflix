const CheckoutPage = () => {
    return (
      <div className="flex bg-gray-800 text-white p-6">
        <div className="flex-1">
          <StepIndicator />
          <CustomerInfoForm />
        </div>
        <div className="ml-6">
          <TicketInfo />
          <CountdownTimer />
        </div>
      </div>
    );
  };
  