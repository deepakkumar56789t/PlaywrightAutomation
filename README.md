# PlaywrightAutomation framework
playwright-bdd-framework/
│
├── features/
│   ├── login/
│   │   ├── login.feature
│   │   └── loginSteps.ts
│   │
│   ├── dashboard/
│   │   ├── dashboard.feature
│   │   └── dashboardSteps.ts
│   │
│   ├── api/
│   │   ├── createUser.feature
│   │   └── createUserSteps.ts
│   │
│   └── hooks/
│       ├── hooks.ts
│       └── world.ts
│
├── pages/
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   └── BasePage.ts
│
├── locators/
│   ├── loginLocators.ts
│   └── dashboardLocators.ts
│
├── fixtures/
│   ├── browserFixture.ts
│   └── apiFixture.ts
│
├── utils/
│   ├── logger.ts
│   ├── helper.ts
│   ├── screenshot.ts
│   └── randomData.ts
│
├── services/
│   ├── authService.ts
│   └── userService.ts
│
├── test-data/
│   ├── users.json
│   └── apiData.json
│
├── config/
│   ├── qa.env
│   ├── stage.env
│   └── prod.env
│
├── reports/
├── screenshots/
├── traces/
├── videos/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── playwright.config.ts
├── cucumber.js
├── package.json
├── tsconfig.json
└── README.md

Playwright Dependencies
