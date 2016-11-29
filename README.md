# CoreOS-GettingStarted
Sample Application and Module demos for Pluralsight course on "Getting Started with CoreOS"

The base configuration of each module leverages the great work at https://github.com/coreos/coreos-vagrant for running CoreOS locally via Vagrant.

# Common Issues

## Cluster doesn't start correct / is reported as unhealthy
Depending on how you have configured your local environment, you may run into an issue where the cluster doesn't start correctly. 

If `etcdctl cluster-health` returns the following error:
```
cluster may be unhealthy: failed to list members
Error:  client: etcd cluster is unavailable or misconfigured
error #0: dial tcp 127.0.0.1:2379: getsockopt: connection refused
error #1: dial tcp 127.0.0.1:4001: getsockopt: connection refused
```

You can resolve this problem by running `vagrant reload --provision` to restart the VMs and force loading the latest configuration changes in your user-data file.
