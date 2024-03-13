### Setup Instructions

run `docker build .`
run ```docker compose up```

ER Diagram

![ERD BillBrilliance](https://github.com/AnuragQ/PricingPageBuilderPro-SaaS-Pricing-Made-Simple/assets/29503684/10025ba7-3f16-472c-803e-796ab70ba543)

Models

User 
- user_id
- username: string
- email: string
- created_date: datetime
- widget : Array

Template 
- plan_title : "string" // style string
- plan_pricing:string
- plan_currency: string
- plan_features_core:string
- plan_features_addons:string
- plan_duration:string

Widget
- widget_id 
- user_id
- creation_date
- updated_at
- template_id
- template_meta_data : [{  
 "plan_title":string,
"plan_pricing":string,
"plan_currency": string,
"plan_features_core":[]
"plan_features_addons":[]
"plan_duration":int
},{ },..]

API routes

/users - /users/widgets - /users/widget/add - /users/widget/update - /users/widget/delete

/templates - /template/{id} - /template/{id}/create - /template/{id}/edit - /template/{id}/delete

/widget - /widget/{id} - /widget/{id}/create - /widget/{id}/edit - /widget/{id}/delete
