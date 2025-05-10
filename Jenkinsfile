pipeline {
  agent any
  environment {
    SONAR_TOKEN        = credentials('sonar-cloud-token')
    SONAR_ORGANIZATION = 'hil-ilma'
    SONAR_PROJECT_KEY  = 'hil-ilma_8.2C-DevSecOps-Scan'
  }
  tools { nodejs 'NodeJS-16' }

  stages {
    stage('Bootstrap DBs') {
      steps {
        sh '''
          # create a network so they can see each other
          docker network create ci-net || true

          # start Mongo
          docker run -d --name ci-mongo --network ci-net mongo:5

          # start MySQL
          docker run -d \
            --name ci-mysql \
            --network ci-net \
            -e MYSQL_ROOT_PASSWORD=root \
            -e MYSQL_DATABASE=test \
            mysql:8

          # wait for both to be ready
          sleep 20
        '''
      }
    }

    stage('Checkout')   { steps { checkout scm } }
    stage('Install')    { steps { sh 'npm ci' } }

stage('Test & Coverage') {
  environment {
    NODE_ENV   = 'test'
    SKIP_DB    = 'true'
  }
  steps {
    sh 'npm test'
    sh 'npx nyc --reporter=lcov --reporter=text-summary mocha --recursive'
    sh 'npx nyc report --reporter=html'
  }
  post {
    always {
      archiveArtifacts artifacts: 'coverage/**', fingerprint: true
    }
  }
}

    stage('Security Audit') {
      steps { sh 'npm audit --audit-level=moderate || true' }
    }

    stage('SonarCloud Analysis') {
      steps {
        withSonarQubeEnv('SonarCloud') {
          sh """
            npx sonar-scanner \
              -Dsonar.token=$SONAR_TOKEN \
              -Dsonar.organization=$SONAR_ORGANIZATION \
              -Dsonar.projectKey=$SONAR_PROJECT_KEY
          """
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 1, unit: 'HOURS') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }

  post {
    always {
      // teardown
      sh '''
        docker stop ci-mongo ci-mysql
        docker rm   ci-mongo ci-mysql
        docker network rm ci-net || true
      '''
    }
  }
}
