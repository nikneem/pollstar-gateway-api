param defaultResourceName string
param location string
param containerVersion string

param integrationResourceGroupName string
param containerAppEnvironmentResourceName string
param applicationInsightsResourceName string

param containerPort int = 3000
param containerAppName string = 'pollstar-gateway-api'

resource containerAppEnvironments 'Microsoft.App/managedEnvironments@2022-03-01' existing = {
  name: containerAppEnvironmentResourceName
  scope: resourceGroup(integrationResourceGroupName)
}
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' existing = {
  name: applicationInsightsResourceName
  scope: resourceGroup(integrationResourceGroupName)
}

resource apiContainerApp 'Microsoft.App/containerApps@2022-03-01' = {
  name: '${defaultResourceName}-aca'
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: containerAppEnvironments.id

    configuration: {
      activeRevisionsMode: 'Single'
      secrets: [
        {
          name: 'application-insights-connectionstring'
          value: applicationInsights.properties.ConnectionString
        }
      ]
      ingress: {
        external: true
        targetPort: containerPort
        transport: 'auto'
        allowInsecure: false
        traffic: [
          {
            weight: 100
            latestRevision: true
          }
        ]
      }
      dapr: {
        enabled: true
        appPort: containerPort
        appId: containerAppName
      }
    }
    template: {
      containers: [
        {
          image: 'pollstarinttestneuacr.azurecr.io/${containerAppName}:${containerVersion}'
          name: containerAppName
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
          env: [
            {
              name: 'APPLICATION_INSIGHTS_CONNECTIONSTRING'
              secretRef: 'application-insights-connectionstring'
            }
            {
              name: 'GATEWAY_VERSION'
              value: containerVersion
            }
            {
              name: 'POLLSTAR_USERS_API'
              value: 'pollstar-users-api'
            }
            {
              name: 'POLLSTAR_SESSIONS_API'
              value: 'pollstar-sessions-api'
            }
          ]

        }
      ]
      scale: {
        minReplicas: 2
        maxReplicas: 10
      }
    }
  }
}
