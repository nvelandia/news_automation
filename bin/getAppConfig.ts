import * as dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

// Define the shape of the configuration object
interface AppConfig {
  deploymentEnv: string;
}

// Function to retrieve and validate environment variables
export function getAppConfig(): AppConfig {
  // Extract environment variables
  const envVars = {
    deploymentEnv: process.env.DEPLOYMENT_ENV!,
    awsRegion: process.env.CDK_DEFAULT_REGION!,
    bucket: process.env.BUCKET!,
    mysqlHost: process.env.MYSQL_HOST!,
    mysqlUser: process.env.MYSQL_USER!,
    mysqlPassword: process.env.MYSQL_PASSWORD!,
    mysqlDatabase: process.env.MYSQL_DATABASE!,
    vpc_id: process.env.VPC_ID!,
    security_group: process.env.SECURITY_GROUP!,
    subnetId1: process.env.SUBNET_ID1!,
    subnetId2: process.env.SUBNET_ID2!,
  };

  // Validate that all required environment variables are defined
  const missingVars = Object.entries(envVars)
    .filter(([key, value]) => value === undefined || value === '')
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing or invalid environment variables: ${missingVars.join(', ')}`
    );
  }

  // Create and return the configuration object with concatenated apiName
  return envVars;
}
