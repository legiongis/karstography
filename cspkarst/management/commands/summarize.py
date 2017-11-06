from django.core import management
from django.core.management.base import BaseCommand, CommandError
from cspkarst.models import Sink
import csv

class Command(BaseCommand):
    help = 'summarizes the sink categories'

    def add_arguments(self, parser):
        parser.add_argument('outfile',help='specify the output location for the summary')

    def handle(self, *args, **options):
        self.summarize(options['outfile'])

        
    def summarize(self,outfile):
        
        print "creating summary of sinks here:"
        print "  --",outfile

        depth_cats = dict(Sink._meta.get_field('depth_cat').choices)
        sink_types = dict(Sink._meta.get_field('sink_type').choices)
        summary_dict = {}
        for d in depth_cats.keys():
            summary_dict[d] = {}
            for s in sink_types.keys():
                if s == "SINKHOLE":
                    probable = Sink.objects.filter(depth_cat=d,sink_type=s,confidence="PROBABLE")
                    summary_dict[d]["Sinkhole - PROBABLE"] = len(probable)
                    possible = Sink.objects.filter(depth_cat=d,sink_type=s,confidence="POSSIBLE")
                    summary_dict[d]["Sinkhole - POSSIBLE"] = len(possible)
                else:
                    total = Sink.objects.filter(depth_cat=d,sink_type=s)
                    summary_dict[d][s] = len(total)
        
        ordered_dep = depth_cats.keys()
        ordered_dep.sort()
        ordered_st = summary_dict[depth_cats.keys()[0]].keys()
        ordered_st.sort()

        with open(outfile,'wb') as out:
            csvout = csv.writer(out)
            csvout.writerow(['depth category','sink type','count'])
            for d in ordered_dep:
                for s in ordered_st:
                    d_label = depth_cats[d]
                    try:
                        st_label = sink_types[s]
                    except:
                        st_label = s
                    count = summary_dict[d][s]
                    row = [d_label,st_label,count]
                    csvout.writerow(row)
                    
                    

        print("done")
